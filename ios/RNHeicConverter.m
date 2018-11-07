
#import "RNHeicConverter.h"

#define allTrim( object ) [object stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet] ]

@implementation RNHeicConverter

static NSString *const EMPTY_PATH = @"Your path is empty";
static NSString *const WRITE_FAILED = @"Can't write to file";
static NSString *const EXTENSION_FAILED = @"Extension of your path is not HEIC";

#define AS(A,B)    [(A) stringByAppendingString:(B)]

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(convert: (NSDictionary*) options
                  resolve:(RCTPromiseResolveBlock) resolve
                  rejecter:(RCTPromiseRejectBlock) reject)
{
    NSString *uri = options[@"path"];
    double quality = [options[@"quality"] floatValue];
    NSString *extension = options[@"extension"];
    NSNumber* type = options[@"extensionType"];
    int extensionType = [type intValue];
    
    // TODO: rework JS-hack
    NSNumber* isAssetsHEIC = options[@"isAssetsHEIC"];
    BOOL haveAsset = [isAssetsHEIC boolValue];
    
    NSData* data;
    NSString* path;
    UIImage* image;
    
    if(haveAsset) {
        image = [self getAssetThumbnail: uri];
        path = [self getDocumentsPath: extension];
    }

    if ([self isEmpty: uri]) {
        if(haveAsset || [self isHeic: uri]) {
            if (!haveAsset) {
                NSString* encodeURI = [self encodeURI: uri];
                path = [self getPath: encodeURI extension: extension];
                image = [self getImage: encodeURI];
            }
            switch (extensionType)
            {
                case 1:
                    data = UIImagePNGRepresentation(image);
                    break;
                case 2:
                    return resolve(@{
                         @"success": @YES,
                         @"base64": AS(@"data:image/png;base64,", [self encodeToBase64String: image])
                     });
                    break;
                default:
                    data = UIImageJPEGRepresentation(image, quality);
                    break;
            }

            BOOL success = [data writeToFile: path atomically: YES];
            if (!success) {
                return resolve(@{@"success": @NO, @"error": WRITE_FAILED});
            }
            return resolve(@{@"success": @YES, @"path": path});
        }
        return resolve(@{@"success": @NO, @"error": EXTENSION_FAILED});
    }
    return resolve(@{ @"success": @NO, @"error": EMPTY_PATH});
}

-(NSString *) encodeToBase64String:(UIImage *)image {
    return [UIImagePNGRepresentation(image) base64EncodedStringWithOptions: NSDataBase64Encoding64CharacterLineLength];
}

-(NSString*) encodeURI: (NSString*) uri
{
    return [uri stringByReplacingPercentEscapesUsingEncoding: NSUTF8StringEncoding];
}

-(BOOL) isEmpty: (NSString*) uri
{
    return [allTrim(uri) length] != 0;
}

-(BOOL) isHeic: (NSString*) uri
{
    NSString *ext = [uri pathExtension];
    return [ext caseInsensitiveCompare:@"heic"] == NSOrderedSame;
}

-(NSString*) getPath: (NSString*) encodeURI
                            extension: (NSString*) extension
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *fileName = [[encodeURI lastPathComponent] stringByDeletingPathExtension];

    return [NSString stringWithFormat:@"%@/%@.%@", documentsDirectory, fileName, extension];
}

-(UIImage*) getImage: (NSString*) encodeURI
{
    NSURL *url = [NSURL fileURLWithPath: encodeURI];
    NSData *data = [NSData dataWithContentsOfURL: url];
    UIImage *image = [UIImage imageWithData: data];

    return image;
}

- (NSString *)valueForKey:(NSString *)key fromQueryItems:(NSArray *)queryItems
{
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"name=%@", key];
    NSURLQueryItem *queryItem = [[queryItems
                                  filteredArrayUsingPredicate:predicate]
                                 firstObject];
    return queryItem.value;
}

- (NSString *)getDocumentsPath:(NSString*) extension
{

    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString * timestamp = [NSString stringWithFormat:@"%.0f",[[NSDate date] timeIntervalSince1970] * 1000];
    NSString *fName = [NSString stringWithFormat:@"%@.%@", timestamp, extension];

    NSString* path = [documentsDirectory stringByAppendingPathComponent: fName];
    return path;
}

-(UIImage *)getAssetThumbnail:(NSString* )uri {
    NSURLComponents *components = [NSURLComponents componentsWithString:uri];
    NSArray *queryItems = components.queryItems;
    NSString *assetId = [self valueForKey:@"id" fromQueryItems:queryItems];
    
    PHFetchResult* assetList = [PHAsset fetchAssetsWithLocalIdentifiers:@[assetId] options:NULL];
    PHAsset *imageAsset = [assetList firstObject];
    
    PHImageRequestOptions *options = [[PHImageRequestOptions alloc]init];
    options.synchronous = true;
    
    __block UIImage *image;
    [PHCachingImageManager.defaultManager requestImageForAsset:imageAsset targetSize:CGSizeMake(10000, 10000) contentMode:PHImageContentModeAspectFit options:options resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
        image = result;
    }];
    return image;
}

@end

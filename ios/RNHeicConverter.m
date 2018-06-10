
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
    
    if ([self isEmpty: uri]) {
        if ([self isHeic: uri]) {
            NSString* encodeURI = [self encodeURI: uri];
            UIImage* image = [self getImage: encodeURI];
            NSData* data;
            
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

            NSString* path = [self getPath: encodeURI extension: extension];
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
    NSString* fname = [encodeURI stringByDeletingPathExtension];
    return [fname stringByAppendingPathExtension: extension];
}

-(UIImage*) getImage: (NSString*) encodeURI
{
    NSURL *url = [NSURL fileURLWithPath: encodeURI];
    NSData *data = [NSData dataWithContentsOfURL: url];
    UIImage *image = [UIImage imageWithData: data];

    return image;
}

@end

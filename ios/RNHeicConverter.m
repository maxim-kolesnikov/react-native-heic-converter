
#import "RNHeicConverter.h"

#define allTrim( object ) [object stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet] ]

@implementation RNHeicConverter

static NSString *const EMPTY_PATH = @"Your path is empty";
static NSString *const WRITE_FAILED = @"Can't write to file";
static NSString *const EXTENSION_FAILED = @"Extension of your path is not HEIC";

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
//    NSString *extension = options[@"extension"];

    if ([self isUriEmpty: uri]) {
        if ([self isHeicFile: uri]) {
            NSString* encodeURI = [self encodeURI: uri];
            NSString* path = [self getNewImagePath: encodeURI];
            NSData* data = [self getImageData: encodeURI quality: quality];
            
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

-(NSString*) encodeURI: (NSString*) uri
{
    return [uri stringByReplacingPercentEscapesUsingEncoding: NSUTF8StringEncoding];
}

-(BOOL) isUriEmpty: (NSString*) uri
{
    return [allTrim(uri) length] != 0;
}

-(BOOL) isHeicFile: (NSString*) uri
{
    NSString *ext = [uri pathExtension];
    return [ext caseInsensitiveCompare:@"heic"] == NSOrderedSame;
}

-(NSString*) getNewImagePath: (NSString*) encodeURI
{
    NSString* fname = [encodeURI stringByDeletingPathExtension];
    return [fname stringByAppendingPathExtension:@"jpg"];
}

-(NSData*) getImageData: (NSString*) encodeURI
                        quality: (float) quality
{
    NSURL *url = [NSURL fileURLWithPath: encodeURI];
    NSData *data = [NSData dataWithContentsOfURL: url];
    UIImage *image = [UIImage imageWithData: data];
    return UIImageJPEGRepresentation(image, quality);
}

@end


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
    NSString *extension = options[@"extension"];

    if ([self isUriEmpty: uri]) {
        if ([self isHeicFile: uri]) {
            NSString* encodeURI = [self encodeURI: uri];
            NSString* path = [self getNewImagePath: encodeURI extension: extension];
            NSData* data = [self getImageData: encodeURI quality: quality extension: extension];
            
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

-(BOOL) isPNGExtention: (NSString*) extension
{
    return [extension caseInsensitiveCompare:@"png"] == NSOrderedSame;
}

-(NSString*) getNewImagePath: (NSString*) encodeURI
                            extension: (NSString*) extension
{
    NSString* fname = [encodeURI stringByDeletingPathExtension];
    return [fname stringByAppendingPathExtension: [self isPNGExtention: extension] ? @"png" : @"jpg"];
}

-(NSData*) getImageData: (NSString*) encodeURI
                        quality: (float) quality
                        extension: (NSString*) extension
{
    NSURL *url = [NSURL fileURLWithPath: encodeURI];
    NSData *data = [NSData dataWithContentsOfURL: url];
    UIImage *image = [UIImage imageWithData: data];
    NSData* result;
    if ([self isPNGExtention: extension]) {
        result = UIImagePNGRepresentation(image);
    } else {
        result = UIImageJPEGRepresentation(image, quality);
    }
    return result;
}

@end

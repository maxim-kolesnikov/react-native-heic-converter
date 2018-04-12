
#import "RNHeicConverter.h"

@interface RNHeicConverter ()

@property (nonatomic, strong) RCTResponseSenderBlock callback;
@property (nonatomic, strong) NSDictionary *defaultOptions;
@property (nonatomic, retain) NSMutableDictionary *options, *response;

@end

#define allTrim( object ) [object stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet] ]

@implementation RNHeicConverter

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getJpgPath:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    NSDictionary* result = [self getPath: [options objectForKey:@"uri"]];
    callback(@[[NSNull null], result]);
}

-(NSDictionary*)getPath: (NSString*) uri
{
    
    if ([allTrim(uri) length] != 0) {
        NSString *heicImageFilePath = uri;
        NSString *ext = [heicImageFilePath pathExtension];
        if ([ext caseInsensitiveCompare:@"heic"] == NSOrderedSame) {
            // create new jpeg file from input heic filepath
            NSString* fname = [uri stringByDeletingPathExtension];
            NSString* newJpgPath = [fname stringByAppendingPathExtension:@"jpg"];;
            
            NSURL *url = [NSURL fileURLWithPath:uri];
            NSData *data = [NSData dataWithContentsOfURL:url];
            UIImage *image = [UIImage imageWithData:data];
            NSData *jpgImageData = UIImageJPEGRepresentation(image, 0.7);
            
            [jpgImageData writeToFile:newJpgPath atomically:YES];
            NSDictionary *result = @{ @"success": @YES, @"path": newJpgPath};
            return result;

        }
    }
    return @{ @"success": @NO, @"path": @""};
}

@end

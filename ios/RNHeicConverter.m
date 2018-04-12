
#import "RNHeicConverter.h"

@implementation RNHeicConverter

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getJpgPath:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    callback(@[@([self getJpgPath:[options objectForKey:@"uri"]])]);
}

-(void)getJpgPath: (NSString*) uri
{
    NSLog(@"This is it: %@", uri;);
}

@end
  
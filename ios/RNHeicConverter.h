
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <UIKit/UIKit.h>
#import <ImageIO/ImageIO.h>
#import <Photos/Photos.h>
#import <Foundation/Foundation.h>
#import <AssetsLibrary/AssetsLibrary.h>

@interface RNHeicConverter : NSObject <RCTBridgeModule>

@end
  

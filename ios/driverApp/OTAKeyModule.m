#import "OTAKeyModule.h"
#import <React/RCTLog.h>

@implementation OTAKeyModule

RCT_EXPORT_MODULE();

// getAccessDeviceToken
RCT_REMAP_METHOD(getAccessDeviceToken,
                 forceRefresh:(BOOL) forceRefresh
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    resolve([[OTAManager instance] accessDeviceTokenWithForceRefresh: forceRefresh]);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"accessDeviceTokenWithForceRefresh", error);
  }
}

// openSession
RCT_REMAP_METHOD(openSession,
                 token:(NSString *) token
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] openSessionWithToken:token
                                        success:^(bool success) {
                                          if (success) {
                                            resolve(@YES);
                                          } else {
                                            resolve(@NO);
                                          }
                                        }
                                        failure:^(OTAErrorCode errorCode, NSError *error) {
                                          reject(@"error", @"openSessionWithToken", error);
                                        }
     ];
    
  }
  @catch (NSError *error)
  {
    reject(@"error", @"openSessionWithToken", error);
  }
}

@end

#import "OTAKeyModule.h"
#import <React/RCTLog.h>

@interface OTAKeyModule () <OTABLEEventsDelegate> {}
@end

@implementation OTAKeyModule
// conforming to OTABLEEventsDelegate protocol
- (void) bluetoothStateChanged:(OTABLEConnectionStatus) status withError:(OTABLEErrorCode) error {
  // connecting, connected, disconnected, etc. see OTAEnums
}
- (void) operationPerformedWithCode:(OTAOperationCode)operationCode andState:(OTAOperationState)operationState {
  // lock, unlock, engine started, etc. see OTAEnums
}

RCT_EXPORT_MODULE();

// getAccessDeviceToken
RCT_REMAP_METHOD(getAccessDeviceToken,
                 forceRefresh:(BOOL) forceRefresh
                 getAccessDeviceTokenResolver:(RCTPromiseResolveBlock)resolve
                 getAccessDeviceTokenRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    NSString *accessDeviceToken = [[OTAManager instance] accessDeviceTokenWithForceRefresh: forceRefresh];
    resolve(accessDeviceToken);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"getAccessDeviceToken", error);
  }
}

// openSession
RCT_REMAP_METHOD(openSession,
                 token:(NSString *) token
                 openSessionResolver:(RCTPromiseResolveBlock)resolve
                 openSessionRejecter:(RCTPromiseRejectBlock)reject)
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
                                          reject(@"error", @"openSession", error);
                                        }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"openSession", error);
  }
}

// register
RCT_REMAP_METHOD(register,
                 registerResolver:(RCTPromiseResolveBlock)resolve
                 registerRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] configureEnvironment:OTAEnvironmentSandbox];
    [OTAManager instance].delegate = self;
    resolve(@YES);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"register", error);
  }
}

// getKey
RCT_REMAP_METHOD(getKey,
                 keyId:(NSString *) keyId
                 getKeyResolver:(RCTPromiseResolveBlock)resolve
                 getKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] keyWithID:keyId
                             success:^(OTAKeyPublic *key) {
                               resolve(key);
                             }
                             failure:^(OTAErrorCode errorCode, NSError *error) {
                               reject(@"error", @"getKey", error);
                             }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"getKey", error);
  }
}

// enableKey
RCT_REMAP_METHOD(enableKey,
                 keyId:(NSString *) keyId
                 enableKeyResolver:(RCTPromiseResolveBlock)resolve
                 enableKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] enableKeyWithID:keyId
                             success:^(OTAKeyPublic *key) {
                               resolve(key);
                             }
                             failure:^(OTAErrorCode errorCode, NSError *error) {
                               reject(@"error", @"enableKey", error);
                             }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"enableKey", error);
  }
}

// getUsedKey
RCT_REMAP_METHOD(getUsedKey,
                 getUsedKeyResolver:(RCTPromiseResolveBlock)resolve
                 getUsedKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    OTAKeyPublic *currentKey = [[OTAManager instance] localKey];
    // probably should to add if-else block for empty "currentKey" occasion
    resolve(currentKey);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"getUsedKey", error);
  }
}

// endKey
RCT_REMAP_METHOD(endKey,
                 keyId:(NSString *) keyId
                 endKeyResolver:(RCTPromiseResolveBlock)resolve
                 endKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] endKeyWithID:keyId
                                success:^(OTAKeyPublic *key) {
                                  resolve(key);
                                }
                                failure:^(OTAErrorCode errorCode, NSError *error) {
                                  reject(@"error", @"enableKey", error);
                                }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"enableKey", error);
  }
}

// switchToKey
RCT_REMAP_METHOD(switchToKey,
                 switchToKeyResolver:(RCTPromiseResolveBlock)resolve
                 switchToKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  // added switch to latest key as in android
  resolve(@YES);
}

@end

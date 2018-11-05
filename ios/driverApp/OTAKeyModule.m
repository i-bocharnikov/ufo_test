#import "OTAKeyModule.h"
#import <React/RCTLog.h>

@interface OTAKeyModule () <OTABLEEventsDelegate> {}
@end

@implementation OTAKeyModule

NSString *LAST_ENABLED_KEYID = nil;

// conforming to OTABLEEventsDelegate protocol
- (void) bluetoothStateChanged:(OTABLEConnectionStatus) status withError:(OTABLEErrorCode) error {
  // connecting, connected, disconnected, etc. see OTAEnums
}
- (void) operationPerformedWithCode:(OTAOperationCode)operationCode andState:(OTAOperationState)operationState {
  // lock, unlock, engine started, etc. see OTAEnums
}

RCT_EXPORT_MODULE();

// Initialize operations
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

// OTAKEY operations
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
                               LAST_ENABLED_KEYID = keyId;
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
                               LAST_ENABLED_KEYID = keyId;
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
    if (currentKey) {
      resolve(currentKey);
    } else {
      resolve(nil);
    }
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
  NSError *error = [NSError errorWithDomain:@"" code:404 userInfo:nil];
  if (!LAST_ENABLED_KEYID) {
    reject(@"error", @"enableKey", error);
    return;
  }
  OTAKeyPublic *currentKey = [[OTAManager instance] localKey];
  [[OTAManager instance] switchToKeyWithID:LAST_ENABLED_KEYID
                           completionBlock:^(bool success) {
                             if (success) {
                               resolve(currentKey);
                             } else {
                               // add some message to error
                               NSError *error = [NSError errorWithDomain:@"" code:404 userInfo:nil];
                               reject(@"error", @"enableKey", error);
                             }
                           }
   ];
}

// Operations with connecting, and checking statuses
// syncVehicleData
RCT_REMAP_METHOD(syncVehicleData,
                 syncVehicleDataResolver:(RCTPromiseResolveBlock)resolve
                 syncVehicleDataRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] syncVehicleDataWithSuccess:^(bool success) {
      if (success) {
        resolve(@YES);
      } else {
        resolve(@NO);
      }
    }
    failure:^(OTAErrorCode errorCode, NSError *error) {
      reject(@"error", @"syncVehicleData", error);
    }];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"syncVehicleData", error);
  }
}

// isConnectedToVehicle
RCT_REMAP_METHOD(isConnectedToVehicle,
                 isConnectedToVehicleResolver:(RCTPromiseResolveBlock)resolve
                 isConnectedToVehicleRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    bool isConnected = [[OTAManager instance] connectedToVehicle];
    if (isConnected) {
      resolve(@YES);
    } else {
      resolve(@NO);
    }
  }
  @catch (NSError *error)
  {
    reject(@"error", @"isConnectedToVehicle", error);
  }
}

// getVehicleData
RCT_REMAP_METHOD(getVehicleData,
                 getVehicleDataResolver:(RCTPromiseResolveBlock)resolve
                 getVehicleDataRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] vehicleDataWithSuccess:^(OTAVehicleData *vehicleData) {
      resolve(@YES);
    }
    failure:^(OTABLEErrorCode errorCode, NSError *error) {
      reject(@"error", @"getVehicleData", error);
    }];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"getVehicleData", error);
  }
}

// connect
RCT_REMAP_METHOD(connect,
                 connectResolver:(RCTPromiseResolveBlock)resolve
                 connectRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] connectToVehicle];
    resolve(@YES);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"connect", error);
  }
}

// disconnect
RCT_REMAP_METHOD(disconnect,
                 disconnectResolver:(RCTPromiseResolveBlock)resolve
                 disconnectRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] disconnectFromVehicle];
    resolve(@YES);
  }
  @catch (NSError *error)
  {
    reject(@"error", @"disconnect", error);
  }
}

// unlockDoors
RCT_REMAP_METHOD(unlockDoors,
                 requestVehicleData:(BOOL) requestVehicleData
                 enableEngine:(BOOL) enableEngine
                 unlockDoorsResolver:(RCTPromiseResolveBlock)resolve
                 unlockDoorsRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] unlockDoorsWithRequestVehicleData:requestVehicleData
                                                enableEngine:enableEngine
                                                     success:^(OTAVehicleData *vehicleData) {
                                                       resolve(@YES);
                                                     }
                                                     failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                       reject(@"error", @"unlockDoors", error);
                                                     }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"unlockDoors", error);
  }
}

// lockDoors
RCT_REMAP_METHOD(lockDoors,
                 requestVehicleData:(BOOL) requestVehicleData
                 lockDoorsResolver:(RCTPromiseResolveBlock)resolve
                 lockDoorsRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] lockDoorsWithRequestVehicleData:requestVehicleData
                                                   success:^(OTAVehicleData *vehicleData) {
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     reject(@"error", @"lockDoors", error);
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"lockDoors", error);
  }
}

// enableEngine
RCT_REMAP_METHOD(enableEngine,
                 requestVehicleData:(BOOL) requestVehicleData
                 enableEngineResolver:(RCTPromiseResolveBlock)resolve
                 enableEngineRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] enableEngineWithRequestVehicleData:requestVehicleData
                                                   success:^(OTAVehicleData *vehicleData) {
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     reject(@"error", @"enableEngine", error);
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"enableEngine", error);
  }
}

// disableEngine
RCT_REMAP_METHOD(disableEngine,
                 requestVehicleData:(BOOL) requestVehicleData
                 disableEngineResolver:(RCTPromiseResolveBlock)resolve
                 disableEngineRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] disableEngineWithRequestVehicleData:requestVehicleData
                                                      success:^(OTAVehicleData *vehicleData) {
                                                        resolve(@YES);
                                                      }
                                                      failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                        reject(@"error", @"disableEngine", error);
                                                      }
     ];
  }
  @catch (NSError *error)
  {
    reject(@"error", @"disableEngine", error);
  }
}

@end

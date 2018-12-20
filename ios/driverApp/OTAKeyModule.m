#import "OTAKeyModule.h"
#import <React/RCTLog.h>

@interface OTAKeyModule () <OTABLEEventsDelegate> {}
@end

@implementation OTAKeyModule

// helpers
static id ObjectOrNull(id object)
{
  return object ?: [NSNull null];
}

+ (NSString *)convertDateToString: (NSDate *)date {
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"YYYY-MM-dd'T'HH:mm:ss.sssZ"];
  return date ? [dateFormatter stringFromDate:date] : @"";
}

// utils and global overriding
+ (NSDictionary *) OTABLEConnectionStatusDictionary
{
  return @{
           @(OTABLEConnected): @"CONNECTED",
           @(OTABLEDiscoveryInProgress): @"IN_PROGRESS",
           @(OTABLEConnectionInProgress): @"IN_PROGRESS",
           @(OTABLENotAvailable): @"DISCONNECTED",
           @(OTABLENotConnected): @"DISCONNECTED",
           };
}

+ (NSDictionary *) OTABLEDoorStateDictionary
{
  return @{
           @(OTADoorsStateLocked): @YES,
           @(OTADoorsStateUnlocked): @NO,
           };
}

+ (NSDictionary*) convertOTAKeyPublic: (OTAKeyPublic *)key {
  return @{
           @"beginDate": [OTAKeyModule convertDateToString:[key beginDate]],
           @"endDate": [OTAKeyModule convertDateToString:[key endDate]],
           @"mileageLimit": [key mileageLimit],
           @"keyId" : [key otaId],
           @"extId" : ObjectOrNull([key extId]),
           @"enabled": [NSNumber numberWithBool:[key enabled]],
           @"keyArgs": ObjectOrNull([key keyArgs]),
           @"keySensitiveArgs": ObjectOrNull([key keySensitiveArgs]),
           @"vehicle": [OTAKeyModule convertOTAVehiclePublic:[key vehicle]],
           };
}

+ (NSDictionary*) convertOTAVehiclePublic: (OTAVehiclePublic *)vehicle {
  return @{
           @"otaId" : [vehicle otaId],
           @"otaExtId" : [vehicle extId],
           @"vin" : [vehicle vin],
           @"brand" : [vehicle brand],
           @"model" : [vehicle model],
           @"plate" : [vehicle plate],
           @"isEnabled": [NSNumber numberWithBool:[vehicle enabled]],
           };
}

+ (NSDictionary*) convertOTAVehicleData: (OTAVehicleData *)vehicleData {
  return @{
           @"doorsState" : [[OTAKeyModule OTABLEDoorStateDictionary] objectForKey:@([vehicleData doorsState])],
           @"engineRunning" : [NSNumber numberWithBool:[vehicleData engineRunning]],
           @"energyCurrent" : ObjectOrNull([vehicleData energyCurrent]),
           };
}

NSString *LAST_ENABLED_KEYID = nil;
NSString *UNEXPECTED_ERROR_CODE = @"999";
RCT_EXPORT_MODULE();

// custom events and listeners
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onOtaVehicleDataUpdated", @"onOtaActionPerformed", @"onOtaBluetoothStateChanged"];
}

- (void) bluetoothStateChanged:(OTABLEConnectionStatus)status withError:(OTABLEErrorCode)error {
  NSString *customStatus = [[OTAKeyModule OTABLEConnectionStatusDictionary] objectForKey:@(status)];
  [self sendEventWithName:@"onOtaBluetoothStateChanged" body:@{@"newBluetoothState": customStatus}];
}

- (void) operationPerformedWithCode:(OTAOperationCode)operationCode andState:(OTAOperationState)operationState {
  [self sendEventWithName:@"onOtaActionPerformed" body:@{@"otaOperation": @(operationCode), @"otaState": @(operationState)}];
}

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
    reject(UNEXPECTED_ERROR_CODE, @"getAccessDeviceToken", error);
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
                                        success:^(BOOL success) {
                                          if (success) {
                                            resolve(@YES);
                                          } else {
                                            resolve(@NO);
                                          }
                                        }
                                        failure:^(OTAErrorCode errorCode, NSError *error) {
                                          reject(@(errorCode).stringValue, @"openSession", error);
                                        }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"openSession", error);
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
    reject(UNEXPECTED_ERROR_CODE, @"register", error);
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
                               resolve([OTAKeyModule convertOTAKeyPublic:key]);
                             }
                             failure:^(OTAErrorCode errorCode, NSError *error) {
                               reject(@(errorCode).stringValue, @"getKey", error);
                             }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"getKey", error);
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
                               resolve([OTAKeyModule convertOTAKeyPublic:key]);
                             }
                             failure:^(OTAErrorCode errorCode, NSError *error) {
                               reject(@(errorCode).stringValue, @"enableKey", error);
                             }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"enableKey", error);
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
      resolve([OTAKeyModule convertOTAKeyPublic:currentKey]);
    } else {
      resolve(nil);
    }
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"getUsedKey", error);
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
                                  resolve([OTAKeyModule convertOTAKeyPublic:key]);
                                }
                                failure:^(OTAErrorCode errorCode, NSError *error) {
                                  reject(@(errorCode).stringValue, @"enableKey", error);
                                }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"enableKey", error);
  }
}

// switchToKey
RCT_REMAP_METHOD(switchToKey,
                 switchToKeyResolver:(RCTPromiseResolveBlock)resolve
                 switchToKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  // maybe should put some specific error code from documentation
  NSError *error = [NSError errorWithDomain:@"" code:404 userInfo:nil];
  if (!LAST_ENABLED_KEYID) {
    reject(UNEXPECTED_ERROR_CODE, @"enableKey", error);
    return;
  }
  OTAKeyPublic *currentKey = [[OTAManager instance] localKey];
  [[OTAManager instance] switchToKeyWithID:LAST_ENABLED_KEYID
                           completionBlock:^(BOOL success) {
                             if (success) {
                               resolve([OTAKeyModule convertOTAKeyPublic:currentKey]);
                             } else {
                               NSError *error = [NSError errorWithDomain:@"" code:404 userInfo:nil];
                               reject(UNEXPECTED_ERROR_CODE, @"enableKey", error);
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
    [[OTAManager instance] syncVehicleDataWithSuccess:^(BOOL success) {
      if (success) {
        resolve(@YES);
      } else {
        resolve(@NO);
      }
    }
    failure:^(OTAErrorCode errorCode, NSError *error) {
      reject(@(errorCode).stringValue, @"syncVehicleData", error);
    }];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"syncVehicleData", error);
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
    reject(UNEXPECTED_ERROR_CODE, @"isConnectedToVehicle", error);
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
      [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
      resolve(@YES);
    }
    failure:^(OTABLEErrorCode errorCode, NSError *error) {
      reject(@(errorCode).stringValue, @"getVehicleData", error);
    }];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"getVehicleData", error);
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
    reject(UNEXPECTED_ERROR_CODE, @"connect", error);
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
    reject(UNEXPECTED_ERROR_CODE, @"disconnect", error);
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
                                                       [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                       resolve(@YES);
                                                     }
                                                     failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                       reject(@(errorCode).stringValue, @"unlockDoors", error);
                                                     }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"unlockDoors", error);
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
                                                     [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     reject(@(errorCode).stringValue, @"lockDoors", error);
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"lockDoors", error);
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
                                                     [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     reject(@(errorCode).stringValue, @"enableEngine", error);
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"enableEngine", error);
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
                                                        [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                        resolve(@YES);
                                                      }
                                                      failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                        reject(@(errorCode).stringValue, @"disableEngine", error);
                                                      }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"disableEngine", error);
  }
}

@end

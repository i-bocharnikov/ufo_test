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
  if(key != nil){
    return @{
           @"beginDate": key.beginDate ? [OTAKeyModule convertDateToString:[key beginDate]] : @"",
           @"endDate": key.endDate ? [OTAKeyModule convertDateToString:[key endDate]] : @"",
           //@"mileageLimit": [key mileageLimit],
           @"keyId" : key.otaId ?[key otaId] : @"",
           @"extId" : key.extId ? ObjectOrNull([key extId]) : @"",
           @"isEnabled": key.enabled ? @YES : @NO,
           //@"keyArgs": ObjectOrNull([key keyArgs]),
           //@"keySensitiveArgs": ObjectOrNull([key keySensitiveArgs]),
           };
  }else{
    return @{};
  }
}

+ (NSDictionary*) convertOTAVehiclePublic: (OTAVehiclePublic *)vehicle {
  if(vehicle != nil){
    return @{
           @"otaId" : vehicle.otaId ? [vehicle otaId] : @"",
           @"otaExtId" : vehicle.extId ? [vehicle extId] : @"",
           @"vin" : vehicle.vin ? [vehicle vin] : @"",
           @"brand" : vehicle.brand ? [vehicle brand] : @"",
           @"model" : vehicle.model ? [vehicle model] : @"",
           @"plate" : vehicle.plate ? [vehicle plate] : @"",
           //@"isEnabled": vehicle.otaId ? @YES : @NO,
           };
  }else{
    return @{};
  }
}

+ (NSDictionary*) convertOTAVehicleData: (OTAVehicleData *)vehicleData {
   if(vehicleData != nil && vehicleData.doorsState  >= 0 && vehicleData.doorsState  <= 3 ){
     return @{
          @"doorsLocked" : vehicleData.doorsState == 1 ? @YES : @NO,
          @"engineRunning" : vehicleData.engineRunning ?  @YES : @NO,
          @"energyCurrent" : vehicleData.energyCurrent ? ObjectOrNull([vehicleData energyCurrent]) : 0,
          };
   }else{
     return @{};
   }
}

NSString *UNEXPECTED_ERROR_CODE = @"999";
NSString *CONNECTED_ERROR_CODE = @"11";
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

    BOOL authenticate = [[OTAManager instance] authenticated];
    if(authenticate){
      resolve(@YES);
      return;
    }

    [[OTAManager instance] openSessionWithToken:token
                                        success:^(bool success) {
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
RCT_REMAP_METHOD(addListeners,
                 registerResolver:(RCTPromiseResolveBlock)resolve
                 registerRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] configureEnvironment:OTAEnvironmentProduction];
    [OTAManager instance].delegate = self;
    resolve(@YES);
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"addListeners", error);
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
    OTAKeyPublic *currentKey = [[OTAManager instance] currentKey];
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
                                  reject(@(errorCode).stringValue, @"endKeyWithID", error);
                                }
     ];
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"endKeyWithID", error);
  }
}

// switchToKey
RCT_REMAP_METHOD(switchToKey,
                 keyId:(NSString *) keyId
                 switchToKeyResolver:(RCTPromiseResolveBlock)resolve
                 switchToKeyRejecter:(RCTPromiseRejectBlock)reject)
{
  
  [[OTAManager instance] switchToKeyWithID:keyId
                           completionBlock:^(BOOL success) {
                             if (success) {
                               resolve(@YES);
                             } else {
                               resolve(@NO);
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
      if([@(errorCode).stringValue  isEqual: @"10"]){
        [self sendEventWithName:@"onOtaBluetoothStateChanged" body:@{@"newBluetoothState": @"DISCONNECTED"}];
      }
      @try{
      reject(@(errorCode).stringValue, @"getVehicleData", error);
    }@catch (NSError *error){/*ignore*/}
    }];
  }
  @catch (NSError *error)
  {
    @try{
    reject(UNEXPECTED_ERROR_CODE, @"getVehicleData", error);
  }@catch (NSError *error){/*ignore*/}
  }
}

// connect
RCT_REMAP_METHOD(connect,
                 connectResolver:(RCTPromiseResolveBlock)resolve
                 connectRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] connectToVehicleWithCompletion:^(NSError *error) {
                                              if (error) {
                                                reject(CONNECTED_ERROR_CODE, @"connect", error);
                                              } else {
                                                resolve(@YES);
                                              }
                                            }
     ];
    
    
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
                                                       if(requestVehicleData && vehicleData ){
                                                       [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                       }
                                                       resolve(@YES);
                                                     }
                                                     failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                       @try{
                                                       reject(@(errorCode).stringValue, @"unlockDoors", error);
                                                       }@catch (NSError *error){/*ignore*/}
                                                     }
     ];
  }
  @catch (NSError *error)
  {
    @try {
    reject(UNEXPECTED_ERROR_CODE, @"unlockDoors", error);
    }@catch (NSError *error){/*ignore*/}
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
                                                     if(requestVehicleData && vehicleData){
                                                     [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                     }
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     
                                                     @try{
                                                       reject(@(errorCode).stringValue, @"lockDoors", error);
                                                     }@catch (NSError *error){/*ignore*/}
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    @try{
    reject(UNEXPECTED_ERROR_CODE, @"lockDoors", error);
    }@catch (NSError *error){/*ignore*/}
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
                                                     if(requestVehicleData && vehicleData){
                                                     [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                     }
                                                     resolve(@YES);
                                                   }
                                                   failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                     @try{
                                                     reject(@(errorCode).stringValue, @"enableEngine", error);
                                                   }@catch (NSError *error){/*ignore*/}
                                                   }
     ];
  }
  @catch (NSError *error)
  {
    @try{
    reject(UNEXPECTED_ERROR_CODE, @"enableEngine", error);
  }@catch (NSError *error){/*ignore*/}
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
                                                        if(requestVehicleData && vehicleData){
                                                        [self sendEventWithName:@"onOtaVehicleDataUpdated" body:[OTAKeyModule convertOTAVehicleData:vehicleData]];
                                                        }
                                                        resolve(@YES);
                                                      }
                                                      failure:^(OTAVehicleData *vehicleData, OTABLEErrorCode errorCode, NSError *error) {
                                                        @try{
                                                        reject(@(errorCode).stringValue, @"disableEngine", error);
                                                        }@catch (NSError *error){/*ignore*/}
                                                      }
     ];
  }
  @catch (NSError *error)
  {
    @try{
    reject(UNEXPECTED_ERROR_CODE, @"disableEngine", error);
    }@catch (NSError *error){/*ignore*/}
  }
}

// closeSession
RCT_REMAP_METHOD(closeSession,
                 closeSessionResolver:(RCTPromiseResolveBlock)resolve
                 closeSessionRejecter:(RCTPromiseRejectBlock)reject)
{
  @try
  {
    [[OTAManager instance] closeSession];
    resolve(@YES);
  }
  @catch (NSError *error)
  {
    reject(UNEXPECTED_ERROR_CODE, @"closeSession", error);
  }
}

@end

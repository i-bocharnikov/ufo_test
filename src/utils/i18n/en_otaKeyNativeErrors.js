import { Platform } from 'react-native';

export default Platform.select({
  ios: {
    // OTABLE ERROR CODE
    '1': 'Bluetooth is off, please switch in on',
    '2':
      "Vehicle is visible, but can't connect to it (too far, or already someone is connected to the vehicle), raised by the SDK",
    '3': 'Action has not been performed, or no response has been received',
    '4':
      'You have a key but it is currently not enabled, please enable it in order to connect to the vehicle',
    '5': 'You currently have no key, please select one first (switch to key)',
    '6':
      'The key is invalid, bad configuration backend side, vehicle needs a reconfiguration',
    '7':
      'It is currently not possible to start the engine, when the doors are locked for example',
    '8':
      'This action is not possible because the CSM does not support it or is deactivated',
    '9': 'No need to connect again, already connected to the vehicle',
    '10': 'Vehicle is not reachable',
    '11': 'Vehicle has not been found after 10s searching',
    '12':
      "Can't process the action, as a previous one is still in progress, wait for it to finish",
    '13': 'You currently have no key, please select one first (switch to key)',
    '14':
      'Action is not possible because you are to far from the vehicle, get closer and try again',
    '16': 'Mileage from token is below the mileage of the vehicle',
    '17':
      'You are trying to use a key which is in the future, wait for the start date given to be reached',
    '18': 'You are trying to use a key which is in the past, create a new one',
    '19':
      'A new key has been enabled in the backend, and has been used with the vehicle, this is because of a security counter. Generate and enable a new key to bypass this',
    '20': 'Vin from token is not matching with the vehicle one',
    '21':
      'The time is not set in the vehicle, network coverage is required at this time to let the SDK set it for you',
    '22':
      'The access end date is now in the past, but lock/unlock will work without auhorisation to start according to the time defined in the vehicle (default is 30min)',
    '23':
      'A critical error occured in the vehicle, action has been dropped, retry',
    '24':
      'A critical error occured in the vehicle, action has been dropped, retry',
    '25':
      'The previous connection has been lost without being explicitly terminated',
    '26': 'Writing first part of data to the CSM has failed',
    '27': 'Writing second part of data to the CSM has failed',
    '28': 'Reading synthesis data from the CSM has failed',
    '29':
      'The action to send to the vehicle is unknown and has not been sent to the CSM',
    '30':
      'The operation state received from the CSM is unknown in this SDK version',
    '31': 'Reading CSM/Modem/BLE firmware versions from the CSM has failed',
    '32': 'Error occurred while connecting to the CSM',
    '33': 'The connection was explicitly terminated by the vehicle',
    '34':
      'Your current key is enabled but has no tokens left, please generate new tokens',
    '35':
      'The BLE scan has been explicitly stopped by calling the stop scan method',
    '36': 'The BLE scan has timed out',
    '37': 'The GPS data could not be read from the CSM while locking/unlocking',
    '38':
      'The action has been executed by the CSM (lock/unlock) but completed event has not been received in time. Possible that doors are already locked or unlocked',
    '39': 'Bluetooth is on',
    '40':
      'Unknown state when SDK is first initialized, it can take some time for iOS CoreBluetooth stack to be initialized. If you try to access BLE during this time, you will get the below error. You could retry until it is working properly',
    '999': 'Not handled state, should not happen',
    // OTA ERROR CODE
    '113': 'The signature verification of the message failed',
    '114':
      'The SDK and server time difference is above 1 minute, request is refused',
    '120': 'The SDK could not be authenticated with the credentials provided',
    '1402': 'The account has been disabled',
    '1903': 'The SDK has been disabled server side',
    '30000': 'The signature is not correct, TokenId field is empty',
    '30001': 'The signature is not correct, AppId field is empty',
    '30002': 'The signature is not correct, SdkId field is empty',
    '30003': 'The signature is not correct, Method field is empty',
    '30004': 'The signature is not correct, Path field is empty',
    '30005': 'The signature is not correct, Timestamp field is empty',
    '30006': 'The signature is not correct, error unknown',
    '102': 'One of the mandatory field has not been provided',
    '2501': 'The vehicle cannot be found',
    '2601': 'The end date is before the start date',
    '40000': 'OTAErrorMissingKeyRequestObject',
    '50000': 'OTAErrorMethodAlreadyInProgress',
    '2620':
      'The key which is trying to be enabled does not belong to the authenticated SDK',
    '103': 'The Json returned by integrator is malformed',
    '20000': 'The information returned by integrator are not valid',
    '20110':
      'The putback request has been refused by integrator (location is incorrect)',
    '20111':
      'The putback request has been refused by integrator (the engine is incorrect)',
    '20112':
      'The putback request has been refused by integrator (the fuel level is incorrect)',

    notFound: 'Unknown error occurred. Description not found.'
  },
  android: {
    // Error Api code
    '113': 'The signature verification of the message failed',
    '114':
      'The SDK and server time difference is above 1 minute, request is refused',
    '120': 'The SDK could not be authenticated with the credentials provided',
    '1402': 'The account has been disabled',
    '1903': 'The SDK has been disabled server side',
    '102': 'One of the mandatory field has not been provided',
    '2501': 'The vehicle cannot be found',
    '2601': 'The end date is before the start date',
    '2654': 'The single shot token number is invalid (1<=Token number<=100)',
    '2620':
      'The key which is trying to be enabled does not belong to the authenticated SDK',
    '2655': 'The key has been already closed in the backend',
    '103': 'The Json returned by integrator is malformed',
    '20000': 'The information returned by integrator are not valid',
    '20110':
      'The putback request has been refused by integrator (location is incorrect)',
    '20111':
      'The putback request has been refused by integrator (the engine is incorrect)',
    '20112':
      'The putback request has been refused by integrator (the fuel level is incorrect)',
    // Bluetooth error code
    BLE_NOT_AVAILABLE:
      'Bluetooth Low Energy Feature is not available on this phone. Meaning no BLE operation will be possible on this phone',
    DEVICE_NOT_FOUND: 'Vehicle has not been found after 10s searching',
    BLUETOOTH_OFF: 'Bluetooth is OFF, switch it ON',
    NOT_CONNECTED: 'Vehicle is not reachable',
    'TIME_OUT_CONNECTION ':
      "Vehicle is visible, but can't connect to it (too far, or already someone is connected to the vehicle), raised by the SDK",
    TIME_OUT_ACTION:
      'Action has not been performed, or no response has been received',
    TIME_OUT_VEHICLE_DATA: 'Reading vehicle data has not been successful',
    OPERATION_IN_PROGRESS:
      "Can't process the action, as a previous one is still in progress, wait for it to finish",
    UNAVAILABLE_FEATURE:
      'This action is not possible because, the vehicle does not support it or is deactivated',
    ALREADY_CONNECTED:
      'No need to connect again, already connected to the vehicle',
    'KEY_INVALID ':
      'The key is invalid, bad configuration backend side, vehicle need a reconfiguration',
    BAD_VIN:
      'Vin from token is not matching with the vehicle one, bad configuration backend side, vehicle need a reconfiguration',
    KEY_INCORRECT_MILEAGE:
      'Mileage from token is below the mileage of the vehicle',
    KEY_TOO_EARLY:
      'You are trying to use a key which is in the future, wait for the start date given to be reached',
    KEY_TOO_LATE:
      'You are trying to use a key with is in the past, create a new one',
    'KEY_DEPRECATED ':
      'The action performed was time limited, and is now not active anymore',
    KEY_INVALIDATED:
      'A new key has been enabled in the backend, and has been used with the vehicle, this is because of a security counter. Generate and enable a new key to bypass this',
    NO_TIME_SET:
      'The time is not set in the vehicle, network coverage is required at this time to let the SDK set it for you',
    OUT_OF_RANGE:
      'Action is not possible because you are too far from the vehicle, get closer and try again',
    GRACE_PERIOD:
      'The access end date is now in the past, but lock/unlock will work without authorization to start according to the time defined in the vehicle (default is 30min)',
    INTERNAL_ERROR:
      'A critical error occurred in the vehicle, action has been dropped, retry',
    TOKENS_NOT_MATCHING:
      'A critical error occurred in the vehicle, action has been dropped, retry',
    CONNECTION_ERROR:
      "Vehicle is visible, but can't connect to it (too far, or already someone is connected to the vehicle), raised by the OS",
    TOKENS_EMPTY:
      'When doing a BLE action but no more tokens are available within the SDK. Call generateVirtualKeys() method to ensure new tokens are issued by the backend then try again',
    SCAN_FAILED_ALREADY_STARTED:
      'Fails to start scan as BLE scan with the same settings is already started by the app',
    SCAN_FAILED_APPLICATION_REGISTRATION_FAILED:
      'Fails to start scan as app cannot be registered',
    SCAN_FAILED_FEATURE_UNSUPPORTED:
      'Fails to start power optimized scan as this feature is not supported',
    SCAN_FAILED_OUT_OF_HARDWARE_RESOURCES:
      'Fails to start scan as it is out of hardware resources',
    SCAN_FAILED_INTERNAL_ERROR: 'Fails to start scan due an internal error',
    UNKNOWN: 'Not handled state, should not happen',
    notFound: 'Unknown error occurred. Description not found.'
  }
});

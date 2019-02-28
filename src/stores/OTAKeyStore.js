import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform
} from 'react-native';
import { observable, action, computed } from 'mobx';
import i18n from 'i18next';
import { persist } from 'mobx-persist';

import { driveStore } from '.';
import { actionStyles, icons } from './../utils/global';
import { showToastError } from './../utils/interaction';
import remoteLoggerService, {
  severityTypes,
  codeTypes
} from '../utils/remoteLoggerService';

const { OTAKeyModule } = NativeModules;
const PlatformEventEmitter =
  Platform.OS === 'ios'
    ? new NativeEventEmitter(OTAKeyModule)
    : DeviceEventEmitter;

class Vehicle {
  @observable vin;
  @observable otaExtId;
  @observable otaId;
  @observable model;
  @observable brand;
  @observable plate;
  @observable isEnabled;
}

class Key {
  @observable beginDate;
  @observable endDate;
  @observable mileageLimit;
  @persist @observable keyId = null;
  @observable extId;
  @persist @observable isEnabled = false;
  @observable isUsed;
  @observable keyArgs;
  @observable keySensitiveArgs;
}

export default class OTAKeyStore {
  ota = OTAKeyModule;
  @persist keyAccessDeviceRegistrationNumber = 9706753;

  @persist keyAccessDeviceIdentifier;
  @persist keyAccessDeviceToken;
  listenersInPlace = false;

  @persist('object', Key) @observable key = new Key();

  @observable isConnecting = false;
  @observable isConnected = false;

  @observable engineRunning = false;
  @observable doorsLocked = true;
  @observable energyCurrent = 0;

  computeActionEnableKey(keyId, actions, onPress) {
    if (keyId && keyId === this.key.keyId) {
      return;
    }
    actions.push({
      style:
        this.key && this.key.isEnabled ? actionStyles.DONE : actionStyles.TODO,
      icon: icons.KEY,
      onPress
    });
  }

  computeActionConnect(actions, onPress) {
    if (!driveStore.inUse) {
      return;
    }
    actions.push({
      style:
        this.isConnecting || this.isConnected
          ? actionStyles.DISABLE
          : actionStyles.TODO,
      icon: icons.CONNECT,
      onPress
    });
  }

  computeActionUnlock(actions, onPress) {
    if (!driveStore.inUse) {
      return;
    }
    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.UNLOCK,
      onPress
    });
  }

  computeActionLock(actions, onPress) {
    if (!driveStore.inUse) {
      return;
    }
    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.LOCK,
      onPress
    });
  }

  computeActionStart(actions, onPress) {
    if (!driveStore.inUse) {
      return;
    }
    actions.push({
      style: this.key ? actionStyles.ACTIVE : actionStyles.DISABLE,
      icon: icons.START,
      onPress
    });
  }

  computeActionStop(actions, onPress) {
    if (!driveStore.inUse) {
      return;
    }
    actions.push({
      style: this.key ? actionStyles.ACTIVE : actionStyles.DISABLE,
      icon: icons.STOP,
      onPress
    });
  }

  @action
  onOtaVehicleDataUpdated = async otaVehicleData => {
    const action = 'otakeystore.onOtaVehicleDataUpdated';
    try {
      await this.remoteOtaKeyNotifierLogger(
        action,
        `Doors ${otaVehicleData.doorsLocked ? 'LOCKED' : 'UNLOCKED'}, engine ${
          otaVehicleData.engineRunning ? 'STARTED' : 'STOPPED'
        } and battery at ${otaVehicleData.energyCurrent + '%'}`
      );
      this.doorsLocked = otaVehicleData.doorsLocked === true ? true : false;
      this.engineRunning = otaVehicleData.engineRunning === true ? true : false;
      this.energyCurrent = otaVehicleData.energyCurrent;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, false, error);
    }
  };

  @action
  onOtaActionPerformed = async otaAction => {
    const action = 'otakeystore.onOtaActionPerformed';

    try {
      await this.remoteOtaKeyNotifierLogger(
        action,
        `Operation: ${otaAction.otaOperation} and State: ${otaAction.otaState}`
      );
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, false, error);
    }
  };

  @action
  onSilentException = async nativeException => {
    const action = 'otakeystore.onSilentException';
    try {
      await this.remoteOtaKeyFatalLogger(
        action,
        false,
        `Native exception: ${
          nativeException.localizedMessage
            ? nativeException.localizedMessage
            : nativeException.message
        }`
      );
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, false, error);
    }
  };

  @action
  onOtaBluetoothStateChanged = async otaBluetoothState => {
    const action = 'otakeystore.onOtaBluetoothStateChanged';
    try {
      if (otaBluetoothState.newBluetoothState === 'CONNECTED') {
        this.isConnected = true;
        this.isConnecting = false;
      } else if (otaBluetoothState.newBluetoothState === 'DISCONNECTED') {
        this.isConnected = false;
        this.isConnecting = false;
      } else {
        this.isConnected = false;
        this.isConnecting = true;
      }
      await this.remoteOtaKeyNotifierLogger(
        action,
        `Vehicle connection in state: ${otaBluetoothState.newBluetoothState}`
      );
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, false, error);
    }
  };

  @action
  async getKeyAccessDeviceIdentifier(force = false, showError = true) {
    const action = `otakeystore.getKeyAccessDeviceIdentifier(${
      force ? 'force new one' : 'reuse'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      if (this.keyAccessDeviceIdentifier != null && !force) {
        await this.remoteOtaKeySkippedLogger(
          action,
          this.keyAccessDeviceIdentifier
        );
        return this.keyAccessDeviceIdentifier;
      }
      this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(
        force
      );
      await this.remoteOtaKeySuccessLogger(
        action,
        this.keyAccessDeviceIdentifier
      );
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
    }
    return this.keyAccessDeviceIdentifier;
  }

  @action
  async openSession(keyAccessDeviceToken, showError = true) {
    const action = `otakeystore.openSession(${keyAccessDeviceToken})`;

    try {
      await this.remoteOtaKeyStartLogger(action);
      if (
        typeof keyAccessDeviceToken !== 'string' ||
        keyAccessDeviceToken === ''
      ) {
        await this.remoteOtaKeyFatalLogger(
          action,
          false,
          'keyAccessDeviceToken is required'
        );
        return false;
      }
      this.keyAccessDeviceToken = keyAccessDeviceToken;
      await this.addListeners();
      const result = await this.ota.openSession(keyAccessDeviceToken);
      await this.remoteOtaKeySuccessLogger(action, result, this.key);
      return result;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async addListeners(showError = true) {
    //const action = `otakeystore.addListeners()`;
    try {
      //await this.remoteOtaKeyStartLogger(action);

      if (this.listenersInPlace) {
        //await this.remoteOtaKeySkippedLogger(action, 'already in place');
        return true;
      }

      this.isConnecting = false;
      this.isConnected = false;

      this.engineRunning = false;
      this.doorsLocked = true;
      this.energyCurrent = 0;

      const result =
        Platform.OS === 'ios'
          ? await this.ota.addListeners()
          : await this.ota.addListeners(this.keyAccessDeviceRegistrationNumber);

      PlatformEventEmitter.addListener(
        'onOtaVehicleDataUpdated',
        this.onOtaVehicleDataUpdated
      );
      PlatformEventEmitter.addListener(
        'onOtaActionPerformed',
        this.onOtaActionPerformed
      );
      PlatformEventEmitter.addListener(
        'onOtaBluetoothStateChanged',
        this.onOtaBluetoothStateChanged
      );
      if (Platform.OS !== 'ios') {
        PlatformEventEmitter.addListener(
          'onSilentException',
          this.onSilentException
        );
      }

      this.listenersInPlace = true;
      //await this.remoteOtaKeySuccessLogger(action, result);
      return result;
    } catch (error) {
      //await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async getVehicleData(showError = true) {
    const action = `otakeystore.getVehicleData()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.getVehicleData();
      await this.remoteOtaKeySuccessLogger(action, result, this.key);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @computed get isKeyEnabled() {
    return this.key && this.key.isEnabled;
  }

  @action
  async enableKey(keyId, showError = true) {
    const action = `otakeystore.enableKey(${keyId})`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      if (typeof keyId !== 'string' || keyId === '') {
        await this.remoteOtaKeyFatalLogger(action, false, 'KeyId is required');
        return false;
      }
      this.key = await this.ota.enableKey(keyId);
      await this.remoteOtaKeySuccessLogger(
        action,
        this.key ? this.key.keyId : 'key empty',
        this.key
      );
      return true;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async endKey(keyId, showError = true) {
    const action = `otakeystore.endKey(${keyId})`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      this.key = await this.ota.endKey(keyId);
      await this.remoteOtaKeySuccessLogger(action, result, this.key);
      return true;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async switchToKey(keyId, showError = true) {
    const action = `otakeystore.switchToKey(${keyId})`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.switchToKey(keyId);
      await this.remoteOtaKeySuccessLogger(action, result, this.key);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async syncVehicleData(showError = true) {
    const action = `otakeystore.syncVehicleData()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.syncVehicleData();
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async configureNetworkTimeouts(
    connectTimeout,
    readTimeout,
    showError = true
  ) {
    const action = `otakeystore.configureNetworkTimeouts()`;
    try {
      await this.remoteOtaKeyStartLogger(action);

      const result = await this.ota.configureNetworkTimeouts(
        connectTimeout,
        readTimeout
      );
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async isConnectedToVehicle(showError = true) {
    const action = `otakeystore.isConnectedToVehicle()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.isConnectedToVehicle();
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async isOperationInProgress(showError = true) {
    const action = `otakeystore.isOperationInProgress()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.isOperationInProgress();
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async getBluetoothState(showError = true) {
    const action = `otakeystore.getBluetoothState()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.getBluetoothState();
      await this.remoteOtaKeySuccessLogger(action, result);
      return result;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return 'UNKNOWN';
    }
  }

  @action
  async connect(showNotification = false, showError = true) {
    const action = `otakeystore.connect(${
      showNotification ? 'with notification' : 'without notification'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result =
        Platform.OS === 'ios'
          ? await this.ota.connect()
          : await this.ota.connect(showNotification);
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async disconnect(showError = true) {
    const action = `otakeystore.disconnect()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.disconnect();
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async unlockDoors(requestVehicleData = false, showError = true) {
    const action = `otakeystore.unlockDoors(${
      requestVehicleData ? 'with vehicle data' : 'without vehicle data'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.unlockDoors(requestVehicleData, true);
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async lockDoors(requestVehicleData = false, showError = true) {
    const action = `otakeystore.lockDoors(${
      requestVehicleData ? 'with vehicle data' : 'without vehicle data'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.lockDoors(requestVehicleData);
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async enableEngine(requestVehicleData = false, showError = true) {
    const action = `otakeystore.enableEngine(${
      requestVehicleData ? 'with vehicle data' : 'without vehicle data'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.enableEngine(requestVehicleData);
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async disableEngine(requestVehicleData = false, showError = true) {
    const action = `otakeystore.disableEngine(${
      requestVehicleData ? 'with vehicle data' : 'without vehicle data'
    })`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      const result = await this.ota.disableEngine(requestVehicleData);
      await this.remoteOtaKeySuccessLogger(action, result);
      return result === 'true' || result === true ? true : false;
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, showError, error);
      await this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async closeSession() {
    const action = `otakeystore.closeSession()`;
    try {
      await this.remoteOtaKeyStartLogger(action);
      await this.ota.closeSession();
      await this.remoteOtaKeySuccessLogger(action, '');
    } catch (error) {
      await this.remoteOtaKeyErrorLogger(action, true, error);
    }
  }

  handleOTAAPIError = async (error, showError) => {
    const { code, message } = error;

    this.isConnecting = false;
    this.isConnected = false;

    this.engineRunning = false;
    this.doorsLocked = true;
    this.energyCurrent = 0;

    switch (code) {
      case 19:
        /*Key has been replaced*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTAAPIError',
          false,
          `OTA API Error Code [${code}]`
        );
        break;
      case '19':
        /*Key has been replaced*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTAAPIError',
          false,
          `OTA API Error Code [${code}]`
        );
        break;
      case 2620:
        /*Key doesn't belong to device*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTAAPIError',
          false,
          `OTA API Error Code [${code}]`
        );
        break;
      case '2620':
        /*Key doesn't belong to device*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTAAPIError',
          false,
          `OTA API Error Code [${code}]`
        );
        break;

      default:
        break;
    }

    if (!showError) {
      return;
    }

    await this.showNativeOTAError(code, message);
  };

  handleOTABLEError = async (error, showError) => {
    const { code, message } = error;

    this.isConnecting = false;
    this.isConnected = false;

    this.engineRunning = false;
    this.doorsLocked = true;
    this.energyCurrent = 0;

    switch (code) {
      case 19:
        /*Key doesn't belong to device*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTABLEError',
          false,
          `OTA BLE Error Code [${code}]`
        );
        break;
      case '19':
        /*Key doesn't belong to device*/
        await this.remoteOtaKeyFatalLogger(
          'handleOTABLEError',
          false,
          `OTA BLE Error Code [${code}]`
        );
        break;

      case 'ALREADY_CONNECTED':
        /*already connected to vehicle*/
        return;
      case 38:
        /*action probably done*/
        return;
      case '38':
        /*action probably done*/
        return;

      default:
        break;
    }

    if (!showError) {
      return;
    }

    await this.showNativeOTAError(code, message);
  };

  showNativeOTAError = async (code, errorMessage) => {
    const defaultCode = 'notFound';
    /*
     * use error code
     * if matching not found in our i18n - use errorMessage
     * if errorMessage empty - use default message
     */
    const message =
      i18n.t(`otaKeyNativeErrors:${code}`) ||
      errorMessage ||
      i18n.t(`otaKeyNativeErrors:${defaultCode}`);

    showToastError(message);
  };

  remoteOtaKeyStartLogger = async (action, description = null) => {
    const severity = severityTypes.INFO;
    const code = codeTypes.SUCCESS;
    const message = `Execution Started...`;
    await this.remoteOtaKeyLogger(severity, code, action, message, description);
  };

  remoteOtaKeySuccessLogger = async (action, result, description = null) => {
    const severity = severityTypes.INFO;
    const code = codeTypes.SUCCESS;
    const message = `Execution done: ${String(result)}`;
    await this.remoteOtaKeyLogger(severity, code, action, message, description);
  };

  remoteOtaKeySkippedLogger = async (action, result, description = null) => {
    const severity = severityTypes.INFO;
    const code = codeTypes.SUCCESS;
    const message = `Execution skipped: ${String(result)}`;
    await this.remoteOtaKeyLogger(severity, code, action, message, description);
  };

  remoteOtaKeyNotifierLogger = async (action, result, description = null) => {
    const severity = severityTypes.INFO;
    const code = codeTypes.SUCCESS;
    const message = `Notification: ${String(result)}`;
    await this.remoteOtaKeyLogger(severity, code, action, message, description);
  };

  remoteOtaKeyErrorLogger = async (action, showError, error) => {
    const severity = severityTypes.ERROR;
    const code =
      error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR;
    const message = `Execution failed ${
      showError ? 'and error is visible' : 'but error is not visible'
    }: ${
      error.code
        ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
        : error.message
    }`;
    await this.remoteOtaKeyLogger(severity, code, action, message, error);
  };

  remoteOtaKeyFatalLogger = async (action, showError, errorMessage) => {
    const severity = severityTypes.FATAL;
    const code = codeTypes.ERROR;
    const message = `Fata error detected ${
      showError ? 'and error is visible' : 'but error is not visible'
    }: ${errorMessage}`;
    await this.remoteOtaKeyLogger(severity, code, action, message);
  };

  remoteOtaKeyLogger = async (
    severity,
    code,
    action,
    message,
    description = null
  ) => {
    const context = {
      keyAccessDeviceIdentifier: this.keyAccessDeviceIdentifier,
      keyAccessDeviceToken: this.keyAccessDeviceToken,
      listenersInPlace: this.listenersInPlace,
      key: this.key,
      doorsLocked: this.doorsLocked,
      engineRunning: this.engineRunning,
      energyCurrent: this.energyCurrent
    };
    await remoteLoggerService.log(
      severity,
      code,
      action,
      message,
      description,
      context
    );
  };
}

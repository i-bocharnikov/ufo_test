import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform
} from 'react-native';
import { observable, action, computed } from 'mobx';
import moment from 'moment';
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

  @persist @observable isConnecting = false;
  @persist @observable isConnected = false;

  @persist @observable engineRunning = false;
  @persist @observable doorsLocked = true;
  @persist @observable energyCurrent = 0;

  otaKeyLogger = async options => {
    const { severity, code, action, message, description } = options;
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
    try {
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.onOtaVehicleDataUpdated',
        code: codeTypes.SUCCESS,
        message: `>> ${otaVehicleData.doorsLocked ? 'LOCKED' : 'UNLOCKED'} / ${
          otaVehicleData.engineRunning ? 'STARTED' : 'STOPPED'
        } / ${otaVehicleData.energyCurrent + '%'}`
      });
      this.doorsLocked = otaVehicleData.doorsLocked === true ? true : false;
      this.engineRunning = otaVehicleData.engineRunning === true ? true : false;
      this.energyCurrent = otaVehicleData.energyCurrent;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.onOtaVehicleDataUpdated',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: '>> exception',
        description: error
      });
    }
  };

  @action
  onOtaActionPerformed = async otaAction => {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.onOtaActionPerformed',
        code: codeTypes.SUCCESS,
        message: `>> ${otaAction.otaOperation} / ${otaAction.otaState}`
      });
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.onOtaActionPerformed',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: '>> exception',
        description: error
      });
    }
  };

  @action
  onOtaBluetoothStateChanged = async otaBluetoothState => {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.onOtaBluetoothStateChanged',
        code: codeTypes.SUCCESS,
        message: `>> ${otaBluetoothState.newBluetoothState}`
      });
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
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.onOtaBluetoothStateChanged',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: '>> exception',
        description: error
      });
    }
  };

  @action
  async addListeners(showError = true): Promise<boolean> {
    if (this.listenersInPlace) {
      return false;
    }

    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.addListeners',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.addListeners(${String(
          this.keyAccessDeviceRegistrationNumber
        )}, ${String(showError)}) start`
      });
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

      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.addListeners',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.addListeners(${String(
          this.keyAccessDeviceRegistrationNumber
        )}, ${String(showError)}) return ${result}`,
        description: result
      });
      this.listenersInPlace = true;

      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.addListeners',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.addListeners(${String(
          this.keyAccessDeviceRegistrationNumber
        )}, ${String(showError)}) failed: ${error}`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async getKeyAccessDeviceIdentifier(
    force: boolean = false,
    showError = true
  ): Promise<string> {
    try {
      if (this.keyAccessDeviceIdentifier != null && !force) {
        return this.keyAccessDeviceIdentifier;
      }
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.getOTAKeyAccessDeviceIdentifier',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.getAccessDeviceToken(${String(force)}, ${String(
          showError
        )}) start`
      });
      this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(
        force
      );
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.getOTAKeyAccessDeviceIdentifier',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.getAccessDeviceToken(${String(force)}, ${String(
          showError
        )}) return ${this.keyAccessDeviceIdentifier}`
      });
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.getOTAKeyAccessDeviceIdentifier',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.getAccessDeviceToken(${String(force)}, ${String(
          showError
        )}) failed: ${error}`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
    }
    return this.keyAccessDeviceIdentifier;
  }

  @action
  async openSession(
    keyAccessDeviceToken: string,
    showError = true
  ): Promise<boolean> {
    if (
      typeof keyAccessDeviceToken !== 'string' ||
      keyAccessDeviceToken === ''
    ) {
      return false;
    }

    try {
      this.keyAccessDeviceToken = keyAccessDeviceToken;
      await this.addListeners();

      const result = await this.ota.openSession(keyAccessDeviceToken);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.openOTASession',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.openSession(${
          this.keyAccessDeviceToken
        }, ${String(showError)}) return ${result}`,
        description: result
      });

      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.openOTASession',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.openSession(${
          this.keyAccessDeviceToken
        }, ${String(showError)}) failed: ${error}`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async getVehicleData(showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.getVehicleData',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.getVehicleData(${String(showError)}) start`
      });
      const result = await this.ota.getVehicleData();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.getVehicleData',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.getVehicleData(${String(
          showError
        )}) return ${JSON.stringify(result)}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.getVehicleData',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.getVehicleData(${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @computed get isKeyEnabled() {
    return this.key && this.key.isEnabled;
  }

  @action
  async enableKey(keyId: string, showError = true): Promise<boolean> {
    if (typeof keyId !== 'string' || keyId === '') {
      return false;
    }

    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.enableKey',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.enableKey(${keyId}, ${String(showError)}) start`
      });
      this.key = await this.ota.enableKey(keyId);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.enableKey',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.enableKey(${keyId}, ${String(
          showError
        )}) return key ${this.key.keyId}`,
        description: this.key
      });
      return true;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.enableKey',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.enableKey(${keyId}, ${String(
          showError
        )}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async endKey(keyId, showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.endKey',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.endKey(${keyId}, ${String(showError)}) start`
      });
      this.key = await this.ota.endKey(keyId);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.endKey',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.endKey(${keyId}, ${String(
          showError
        )}) return key ${this.key.keyId}`,
        description: this.key
      });
      return true;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.endKey',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.endKey(${keyId}, ${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async switchToKey(keyId, showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.switchToKey',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.switchToKey(${keyId}, ${String(showError)}) start`
      });
      let result = await this.ota.switchToKey(keyId);
      await this.otaKeyLogger({
        severity: result ? severityTypes.INFO : severityTypes.ERROR,
        action: 'otakeystore.switchToKey',
        code: result ? codeTypes.SUCCESS : codeTypes.ERROR,
        message: `<- this.ota.switchToKey( ${keyId}, ${String(
          showError
        )}) return key ${result}`,
        description: this.key
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.switchToKey',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.switchToKey(${keyId}, ${String(
          showError
        )}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async syncVehicleData(showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.syncVehicleData',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.syncVehicleData(${String(showError)}) start`
      });
      const result = await this.ota.syncVehicleData();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.syncVehicleData',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.syncVehicleData(${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.syncVehicleData',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.syncVehicleData(${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTAAPIError(error, showError);
      return false;
    }
  }

  @action
  async configureNetworkTimeouts(
    connectTimeout: Number,
    readTimeout: Number,
    showError = true
  ): Promise<boolean> {
    // unused method
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.configureOTANetworkTimeouts',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.configureNetworkTimeouts(${String(
          connectTimeout
        )}, ${String(readTimeout)}, ${String(showError)}) start`
      });
      const result = await this.ota.configureNetworkTimeouts(
        connectTimeout,
        readTimeout
      );
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.configureOTANetworkTimeouts',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.configureNetworkTimeouts(${String(
          connectTimeout
        )}, ${String(readTimeout)}, ${String(showError)}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.configureOTANetworkTimeouts',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.configureNetworkTimeouts(${String(
          connectTimeout
        )}, ${String(readTimeout)}, ${String(showError)}) failed: ${error}`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async isConnectedToVehicle(showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.isConnectedToVehicle',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.isConnectedToVehicle(${String(showError)}) start`
      });
      const result = await this.ota.isConnectedToVehicle();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.isConnectedToVehicle',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.isConnectedToVehicle(${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.isConnectedToVehicle',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.isConnectedToVehicle(${String(
          showError
        )}) failed: ${error}`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async isOperationInProgress(showError = true): Promise<boolean> {
    // unused method
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.isOTAOperationInProgress',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.isOperationInProgress(${String(showError)}) start`
      });
      const result = await this.ota.isOperationInProgress();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.isOTAOperationInProgress',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.isOperationInProgress(${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.isOTAOperationInProgress',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.isOperationInProgress(${String(
          showError
        )}) failed: ${error}`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async getBluetoothState(showError = true): Promise<string> {
    // unused method
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.getBluetoothState',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.getBluetoothState(${String(showError)}) start`
      });
      const result = await this.ota.getBluetoothState();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.getBluetoothState',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.getBluetoothState(${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.getBluetoothState',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.getBluetoothState(${String(
          showError
        )}) failed: ${error}`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return 'UNKNOWN';
    }
  }

  @action
  async connect(showNotification = false, showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.connectToVehicle',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.connect(${String(showNotification)}, ${String(
          showError
        )}) start`
      });
      const result =
        Platform.OS === 'ios'
          ? await this.ota.connect()
          : await this.ota.connect(showNotification);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.connectToVehicle',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.connect(${String(showNotification)}, ${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      if ((error.code = 'ALREADY_CONNECTED')) {
        return true;
      }

      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.connectToVehicle',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.connect(${String(showNotification)}, ${String(
          showError
        )}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async disconnect(showError = true): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.disconnectFromVehicle',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.disconnect(${String(showError)}) start`
      });
      const result = await this.ota.disconnect();
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.disconnectFromVehicle',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.disconnect(${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.disconnectFromVehicle',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.disconnect(${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async unlockDoors(
    requestVehicleData: boolean = false,
    showError = true
  ): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.unlockDoors',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.unlockDoors(${String(
          requestVehicleData
        )}, ${String(showError)}) start`
      });
      const result = await this.ota.unlockDoors(requestVehicleData, true);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.unlockDoors',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.unlockDoors(${String(
          requestVehicleData
        )},  ${String(showError)}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.unlockDoors',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.unlockDoors(${String(
          requestVehicleData
        )}, ${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async lockDoors(
    requestVehicleData: boolean = false,
    showError = true
  ): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.lockDoors',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.lockDoors(${String(requestVehicleData)}, ${String(
          showError
        )},) start`
      });
      const result = await this.ota.lockDoors(requestVehicleData);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.lockDoors',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.lockDoors(${String(requestVehicleData)}, ${String(
          showError
        )}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.lockDoors',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.lockDoors(${String(requestVehicleData)}, ${String(
          showError
        )}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async enableEngine(
    requestVehicleData: boolean = false,
    showError = true
  ): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.enableEngine',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.enableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) start`
      });
      const result = await this.ota.enableEngine(requestVehicleData);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.enableEngine',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.enableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.enableEngine',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.enableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async disableEngine(
    requestVehicleData: boolean = false,
    showError = true
  ): Promise<boolean> {
    try {
      await this.otaKeyLogger({
        severity: severityTypes.DEBUG,
        action: 'otakeystore.disableEngine',
        code: codeTypes.SUCCESS,
        message: `-> this.ota.disableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) start`
      });
      const result = await this.ota.disableEngine(requestVehicleData);
      await this.otaKeyLogger({
        severity: severityTypes.INFO,
        action: 'otakeystore.disableEngine',
        code: codeTypes.SUCCESS,
        message: `<- this.ota.disableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) return ${result}`,
        description: result
      });
      return result;
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.disableEngine',
        code: error.code && !isNaN(error.code) ? error.code : codeTypes.ERROR,
        message: `<- this.ota.disableEngine(${String(
          requestVehicleData
        )}, ${String(showError)}) failed: ${
          error.code
            ? i18n.t(`otaKeyNativeErrors:${error.code}`) || error.message
            : error.message
        }`,
        description: error
      });
      this.handleOTABLEError(error, showError);
      return false;
    }
  }

  @action
  async closeSession() {
    try {
      await this.ota.closeSession();
    } catch (error) {
      await this.otaKeyLogger({
        severity: severityTypes.ERROR,
        action: 'otakeystore.closeSession',
        code: error.code,
        message: `<- this.ota.closeSession failed: ${error}`,
        description: error
      });
    }
  }

  handleOTAAPIError = (error, showError) => {
    const { code, message } = error;
    if (!showError) {
      return;
    }

    this.showNativeOTAError(code, message);
  };

  handleOTABLEError = (error, showError) => {
    const { code, message } = error;
    if (!showError || code === 'ALREADY_CONNECTED') {
      return;
    }

    this.showNativeOTAError(code, message);
  };

  showNativeOTAError = (errorCode, errorMessage) => {
    const defaultCode = 'notFound';
    /*
     * use error code
     * if matching not found in our i18n - use errorMessage
     * if errorMessage empty - use default message
     */
    const message =
      i18n.t(`otaKeyNativeErrors:${errorCode}`) ||
      errorMessage ||
      i18n.t(`otaKeyNativeErrors:${defaultCode}`);

    showToastError(message);
  };
}

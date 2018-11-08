import {
    NativeModules,
    DeviceEventEmitter,
    NativeEventEmitter,
    Platform,
    Alert
} from 'react-native';
import { observable, action, computed } from 'mobx';
import moment from 'moment';
import i18n from 'i18next';

import { driveStore } from '.';
import { actionStyles, icons } from './../utils/global';
import { postToApi, checkConnectivity } from './../utils/api';
import { showToastError } from './../utils/interaction';
import logger, { codeTypes, severityTypes } from './../utils/userActionsLogger';

const { OTAKeyModule } = NativeModules;
const PlatformEventEmitter = Platform === 'ios'
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
    @observable vehicle = new Vehicle;
    @observable keyId;
    @observable extId;
    @observable isEnabled;
    @observable isUsed;
    @observable keyArgs;
    @observable keySensitiveArgs;
}

class OTAKeyStore {

    ota = OTAKeyModule;
    keyAccessDeviceRegistrationNumber = 9706753;

    keyAccessDeviceIdentifier;
    keyAccessDeviceToken;
    isRegistered = false;

    @observable otaLog = '';

    @observable key = new Key;

    @observable isConnecting = false;
    @observable isConnected = false;

    @observable engineRunning = false;
    @observable doorsLocked = true;
    @observable energyCurrent = 0;

    otaKeyLogger = async options => {
        const date = moment();
        const { severity, code, action, message, description } = options;
        const logExtraData = {
            context: {key: this.key, doorsLocked: this.doorsLocked},
            momentDate: date
        };

        await logger(severity, code, action, message, description, logExtraData);
        this.otaLog = `${date.format('HH:mm:ss')} ${severity} ${message}\n${this.otaLog}`;
    };

    computeActionEnableKey(actions, onPress) {
        if (!driveStore.inUse || this.isKeyEnabled) {
            return;
        }
        actions.push({
            style: this.key && this.key.isEnabled ? actionStyles.DONE : actionStyles.TODO,
            icon: icons.KEY,
            onPress
        });
    }

    computeActionConnect(actions, onPress) {
        if (!driveStore.inUse) {
            return;
        }
        actions.push({
            style: this.isConnecting || this.isConnected ? actionStyles.DISABLE : actionStyles.TODO,
            icon: icons.CONNECT,
            onPress
        });
    }

    computeActionUnlock(actions, onPress) {
        if (!driveStore.inUse) {
            return;
        }
        actions.push({
            style: this.isKeyEnabled ? actionStyles.ACTIVE : actionStyles.DISABLE,
            icon: icons.UNLOCK,
            onPress
        });
    }

    computeActionLock(actions, onPress) {
        if (!driveStore.inUse) {
            return;
        }
        actions.push({
            style: this.isKeyEnabled ? actionStyles.ACTIVE : actionStyles.DISABLE,
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
                action: 'onOtaVehicleDataUpdated',
                code: codeTypes.SUCCESS,
                message: `>> ${
                    otaVehicleData.doorsLocked ? 'LOCKED' : 'UNLOCKED'
                } / ${
                    otaVehicleData.engineRunning ? 'STARTED' : 'STOPPED'
                } / ${
                    otaVehicleData.energyCurrent + '%'
                }`
            });
            this.doorsLocked = otaVehicleData.doorsLocked === true ? true : false;
            this.engineRunning = otaVehicleData.engineRunning === true ? true : false;
            this.energyCurrent = otaVehicleData.energyCurrent;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'onOtaVehicleDataUpdated',
                code: codeTypes.ERROR,
                message: '>> exception',
                description: error
            });
        }
    }

    @action
    onOtaActionPerformed = async otaAction => {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'onOtaActionPerformed',
                code: codeTypes.SUCCESS,
                message: `>> ${otaAction.otaOperation} / ${otaAction.otaState}`
            });
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'onOtaActionPerformed',
                code: codeTypes.ERROR,
                message: '>> exception',
                description: error
            });
        }
    }

    @action
    onOtaBluetoothStateChanged = async otaBluetoothState => {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'onOtaBluetoothStateChanged',
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
                action: 'onOtaBluetoothStateChanged',
                code: codeTypes.ERROR,
                message: '>> exception',
                description: error
            });
        }
    }

    @action
    async register(showError = true): Promise<boolean> {
        if (this.isRegistered) {
            return false;
        }

        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'register',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.register(${
                    String(this.keyAccessDeviceRegistrationNumber)
                }, ${
                    String(showError)
                }) start`
            });
            const result = Platform.OS === 'ios'
                ? await this.ota.register()
                : await this.ota.register(this.keyAccessDeviceRegistrationNumber);

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
                severity: severityTypes.DEBUG,
                action: 'registerToOTA',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.register(${
                    String(this.keyAccessDeviceRegistrationNumber)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            this.isRegistered = true;

            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'registerToOTA',
                code: codeTypes.ERROR,
                message: `<- this.ota.register(${
                    String(this.keyAccessDeviceRegistrationNumber)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async getKeyAccessDeviceIdentifier(force: boolean = false, showError = true): Promise<string> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'getOTAKeyAccessDeviceIdentifier',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.getAccessDeviceToken(${
                    String(force)
                }, ${
                    String(showError)
                }) start`
            });
            this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(force);
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'getOTAKeyAccessDeviceIdentifier',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.getAccessDeviceToken(${
                    String(force)
                }, ${
                    String(showError)
                }) return ${
                    this.keyAccessDeviceIdentifier
                }`
            });
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'getOTAKeyAccessDeviceIdentifier',
                code: codeTypes.ERROR,
                message: `<- this.ota.getAccessDeviceToken(${
                    String(force)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
        }
        return this.keyAccessDeviceIdentifier;
    }

    @action
    async openSession(keyAccessDeviceToken: string, showError = true): Promise<boolean> {
        if (!keyAccessDeviceToken || !keyAccessDeviceToken instanceof String || keyAccessDeviceToken === '') {
            return false;
        }

        try {
            this.keyAccessDeviceToken = keyAccessDeviceToken;
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'openOTASession',
                code: codeTypes.SUCCESS,
                message : `-> this.ota.openSession(${
                    this.keyAccessDeviceToken
                }, ${
                    String(showError)
                }) start`
            });

            const result = await this.ota.openSession(keyAccessDeviceToken);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'openOTASession',
                code: codeTypes.SUCCESS,
                message : `<- this.ota.openSession(${
                    this.keyAccessDeviceToken
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });

            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'openOTASession',
                code: codeTypes.ERROR,
                message: `<- this.ota.openSession(${
                    this.keyAccessDeviceToken
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
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
                action: 'getVehicleData',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.getVehicleData(${String(showError)}) start`
            });
            const result = await this.ota.getVehicleData();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'getVehicleData',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.getVehicleData(${
                    String(showError)
                }) return ${
                    JSON.stringify(result)
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'getVehicleData',
                code: codeTypes.ERROR,
                message: `<- this.ota.getVehicleData(${String(showError)}) failed ${error}`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async getKey(keyId: string, showError = true): Promise<boolean> {
        if (!keyId || !keyId instanceof String || keyId === '') {
            return false;
        }

        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'getKey',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.getKey(${keyId}, ${String(showError)}) start`
            });
            this.key = await this.ota.getKey(keyId);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'getKey',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.getKey(${
                    keyId
                }, ${
                    String(showError)
                }) return ${
                    JSON.stringify(this.key)
                }`,
                description: this.key
            });
            return true;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'getKey',
                code: codeTypes.ERROR,
                message: `<- this.ota.getKey(${
                    keyId
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async getUsedKey(showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'getUsedKey',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.getUsedKey(${String(showError)}) start`
            });
            this.key = await this.ota.getUsedKey();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'getUsedKey',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.getUsedKey(${
                    String(showError)
                }) return ${
                    JSON.stringify(this.key)
                }`,
                description: this.key
            });
            return true;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'getUsedKey',
                code: codeTypes.ERROR,
                message: `<- this.ota.getUsedKey(${String(showError)}) failed ${error}`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @computed get isKeyEnabled() {
        return this.key && driveStore.rental && this.key.keyId === driveStore.rental.key_id && this.key.isEnabled;
    }

    @action
    async enableKey(keyId: string, showError = true): Promise<boolean> {
        if (!keyId || !keyId instanceof String || keyId === '') {
            return false;
        }

        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'enableKey',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.enableKey(${keyId}, ${String(showError)}) start`
            });
            this.key = await this.ota.enableKey(keyId);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'enableKey',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.enableKey(${
                    keyId
                }, ${
                    String(showError)
                }) return ${
                    JSON.stringify(this.key)
                }`,
                description: this.key
            });
            return true
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'enableKey',
                code: codeTypes.ERROR,
                message: `<- this.ota.enableKey(${keyId}, ${String(showError)}) failed ${error}`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async endKey(showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'endKey',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.endKey(${this.key.keyId}, ${String(showError)}) start`
            });
            this.key = await this.ota.endKey(this.key.keyId);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'endKey',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.endKey(${
                    this.key.keyId
                }, ${
                    String(showError)
                }) return ${
                    JSON.stringify(this.key)
                }`,
                description: this.key
            });
            return true;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'endKey',
                code: codeTypes.ERROR,
                message: `<- this.ota.endKey(${
                    this.key.keyId
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async switchToKey(showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'switchToKey',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.switchToKey(${
                    JSON.stringify(this.key)
                }, ${
                    String(showError)
                }) start`
            });
            this.key = await this.ota.switchToKey();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'switchToKey',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.switchToKey(${
                    JSON.stringify(this.key)
                }, ${
                    String(showError)
                }) return ${
                    JSON.stringify(this.key)
                }`,
                description: this.key
            });
            return true;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'switchToKey',
                code: codeTypes.ERROR,
                message: `<- this.ota.switchToKey(${
                    JSON.stringify(this.key)
                }, ${
                    String(showError)
                }) failed ${
                    error
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
                action: 'syncVehicleData',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.syncVehicleData(${String(showError)}) start`
            });
            const result = await this.ota.syncVehicleData();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'syncVehicleData',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.syncVehicleData(${String(showError)}) return ${result}`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'syncVehicleData',
                code: codeTypes.ERROR,
                message: `<- this.ota.syncVehicleData(${String(showError)}) failed ${error}`,
                description: error
            });
            this.handleOTAAPIError(error, showError);
            return false;
        }
    }

    @action
    async configureNetworkTimeouts(connectTimeout: Number, readTimeout: Number, showError = true): Promise<boolean> {
        // unused method
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'configureOTANetworkTimeouts',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.configureNetworkTimeouts(${
                    String(connectTimeout)
                }, ${
                    String(readTimeout)
                }, ${
                    String(showError)
                }) start`
            });
            const result = await this.ota.configureNetworkTimeouts(connectTimeout, readTimeout);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'configureOTANetworkTimeouts',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.configureNetworkTimeouts(${
                    String(connectTimeout)
                }, ${
                    String(readTimeout)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'configureOTANetworkTimeouts',
                code: codeTypes.ERROR,
                message: `<- this.ota.configureNetworkTimeouts(${
                    String(connectTimeout)
                }, ${
                    String(readTimeout)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
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
                action: 'isConnectedToVehicle',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.isConnectedToVehicle(${String(showError)}) start`
            });
            const result = await this.ota.isConnectedToVehicle();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'isConnectedToVehicle',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.isConnectedToVehicle(${String(showError)}) return ${result}`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'isConnectedToVehicle',
                code: codeTypes.ERROR,
                message: `<- this.ota.isConnectedToVehicle(${String(showError)}) failed ${error}`,
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
                action: 'isOTAOperationInProgress',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.isOperationInProgress(${String(showError)}) start`
            });
            const result = await this.ota.isOperationInProgress();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'isOTAOperationInProgress',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.isOperationInProgress(${String(showError)}) return ${result}`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'isOTAOperationInProgress',
                code: codeTypes.ERROR,
                message: `<- this.ota.isOperationInProgress(${String(showError)}) failed ${error}`,
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
                action: 'getBluetoothState',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.getBluetoothState(${String(showError)}) start`
            });
            const result = await this.ota.getBluetoothState();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'getBluetoothState',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.getBluetoothState(${String(showError)}) return ${result}`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'getBluetoothState',
                code: codeTypes.ERROR,
                message: `<- this.ota.getBluetoothState(${String(showError)}) failed ${error}`,
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
                action: 'connectToVehicle',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.connect(${String(showNotification)}, ${String(showError)}) start`
            });
            const result = Platform.OS === 'ios'
                ? await this.ota.connect()
                : await this.ota.connect(showNotification);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'connectToVehicle',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.connect(${
                    String(showNotification)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            if (error.code = 'ALREADY_CONNECTED') {
                return true;
            }

            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'connectToVehicle',
                code: codeTypes.ERROR,
                message: `<- this.ota.connect(${
                    String(showNotification)
                }, ${
                    String(showError)
                }) failed ${
                    error
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
                action: 'disconnectFromVehicle',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.disconnect(${String(showError)}) start`
            });
            const result = await this.ota.disconnect();
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'disconnectFromVehicle',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.disconnect(${String(showError)}) return ${result}`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'disconnectFromVehicle',
                code: codeTypes.ERROR,
                message: `<- this.ota.disconnect(${String(showError)}) failed ${error}`,
                description: error
            });
            this.handleOTABLEError(error, showError);
            return false;
        }
    }

    @action
    async unlockDoors(requestVehicleData: boolean = false, showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'unlockDoors',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.unlockDoors(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) start`
            });
            const result = await this.ota.unlockDoors(requestVehicleData, true);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'unlockDoors',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.unlockDoors(${
                    String(requestVehicleData)
                },  ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'unlockDoors',
                code: codeTypes.ERROR,
                message: `<- this.ota.unlockDoors(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTABLEError(error, showError);
            return false;
        }
    }

    @action
    async lockDoors(requestVehicleData: boolean = false, showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'lockDoors',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.lockDoors(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                },) start`
            });
            const result = await this.ota.lockDoors(requestVehicleData);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'lockDoors',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.lockDoors(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'lockDoors',
                code: codeTypes.ERROR,
                message: `<- this.ota.lockDoors(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTABLEError(error, showError);
            return false;
        }
    }


    @action
    async enableEngine(requestVehicleData: boolean = false, showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'enableEngine',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.enableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) start`
            });
            const result = await this.ota.enableEngine(requestVehicleData);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'enableEngine',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.enableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'enableEngine',
                code: codeTypes.ERROR,
                message: `<- this.ota.enableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTABLEError(error, showError);
            return false;
        }
    }

    @action
    async disableEngine(requestVehicleData: boolean = false, showError = true): Promise<boolean> {
        try {
            await this.otaKeyLogger({
                severity: severityTypes.DEBUG,
                action: 'disableEngine',
                code: codeTypes.SUCCESS,
                message: `-> this.ota.disableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) start`
            });
            const result = await this.ota.disableEngine(requestVehicleData);
            await this.otaKeyLogger({
                severity: severityTypes.INFO,
                action: 'disableEngine',
                code: codeTypes.SUCCESS,
                message: `<- this.ota.disableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) return ${
                    result
                }`,
                description: result
            });
            return result;
        } catch (error) {
            await this.otaKeyLogger({
                severity: severityTypes.ERROR,
                action: 'disableEngine',
                code: codeTypes.ERROR,
                message: `<- this.ota.disableEngine(${
                    String(requestVehicleData)
                }, ${
                    String(showError)
                }) failed ${
                    error
                }`,
                description: error
            });
            this.handleOTABLEError(error, showError);
            return false;
        }
    }

    handleOTAAPIError = (error, showError) => {
        const { code, message } = error;
        if (!showError) {
            return;
        }

        this.showNativeOTAError(code, message);
    };

    handleOTABLEError(error, showError) {
        const { code, message } = error;
        if (!showError || code === 'ALREADY_CONNECTED') {
            return;
        }

        this.showNativeOTAError(code, message);
    }

    showNativeOTAError = (errorCode, errorMessage) => {
        const defaultCode = 'notFound';
        /*
         * use error code
         * if matching not found in our i18n - use errorMessage
         * if errorMessage empty - use default message
         */
        const message = i18n.t(`otaKeyNativeErrors:${errorCode}`)
            || errorMessage
            || i18n.t(`otaKeyNativeErrors:${defaultCode}`);
            
        showToastError(message);
    };
}

export default new OTAKeyStore();

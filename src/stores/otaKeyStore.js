// @flow  
import { NativeModules, DeviceEventEmitter, AppRegistry } from 'react-native';
import { observable, action, computed } from 'mobx';
import moment from 'moment';
import { driveStore } from '.';
import { actionStyles, icons } from '../utils/global';
import { postToApi, checkConnectivity } from '../utils/api';
import { showToastError } from '../utils/interaction';
import { persist } from 'mobx-persist';

const RENTAL_STATUS = {
    CONFIRMED: 'confirmed',
    ONGOING: 'ongoing',
    CLOSED: 'closed',
}

class Vehicle {
    @persist @observable vin: String;
    @persist @observable otaExtId: String;
    @persist @observable otaId: Number;
    @persist @observable model: String;
    @persist @observable brand: String;
    @persist @observable plate: String;
    @persist @observable isEnabled: boolean;
}


class Key {
    @persist @observable beginDate: Moment;
    @persist @observable endDate: Moment;
    @persist @observable mileageLimit: Number;
    @persist @observable vehicle: Vehicle = new Vehicle;
    @persist @observable keyId: Number;
    @persist @observable extId: String;
    @persist @observable isEnabled: boolean;
    @persist @observable isUsed: boolean;
    @persist @observable keyArgs: String;
    @persist @observable keySensitiveArgs: String;
}

class VehicleData {
    @persist @observable engineRunning: boolean;
    @persist @observable doorsLocked: boolean;
    @persist @observable energyCurrent: Number;

/*     @observable id: Number;
    @observable date: Moment;
    @observable mileageStart: Number;
    @observable mileageCurrent: Number;
    @observable distanceType: String;
    @observable energyType: String;
    @observable batteryVoltage: Number;
    @observable activeDtcErrorCode: Number;
    @observable connectedToCharger: boolean;
    @observable energyStart: Number;
    @observable energyCurrent: Number;
    @observable malfunctionIndicatorLamp: boolean;
    @observable gpsLatitude: Number;
    @observable gpsLongitude: Number;
    @observable gpsAccuracy: Number;
    @observable gpsCaptureDate: Moment;
    @observable sdkGpsLatitude: Number;
    @observable sdkGpsLongitude: Number;
    @observable sdkGpsAccuracy: Number;
    @observable sdkGpsCaptureDate: Moment;
    @observable fuelUnit: String;
    @observable odometerUnit: String;
    @observable isBleCaptured: boolean;
    @observable operationCode: String;
    @observable doorsState: String;
    @observable operationState: String;
 */}


class OTAKeyStore {


    constructor() {
        //AppRegistry.registerHeadlessTask('ExportUserExperienceTask', this.exportPendingUserExperiences);
    }


    userExperiences = []

    async exportPendingUserExperiences(taskData) {
        try {
            console.log("exportPendingUserExperiences started with ", taskData)
            if (await checkConnectivity()) {
                let isConnected = true
                while (this.userExperiences && this.userExperiences.length > 0 && isConnected) {
                    try {
                        await postToApi("/user_experiences", this.userExperiences.shift())
                    } catch (error) {
                        isConnected = await checkConnectivity()
                        console.log("exportPendingUserExperiences failed", error)
                    }
                }
            }
        } catch (error) {
            console.log("exportPendingUserExperiences failed with ", error)
        }
        console.log("exportPendingUserExperiences stopped with ", taskData)
    }

    keyAccessDeviceRegistrationNumber = 9706753

    ota = NativeModules.OTAKeyModule
    @persist keyAccessDeviceRegistrationNumber: Number
    @persist keyAccessDeviceIdentifier: string
    @persist keyAccessDeviceToken: string

    @observable otaLog: string = ""

    @persist('object', Key) @observable key: Key = new Key

    @persist @observable isConnecting = false
    @persist @observable isConnected = false

    @persist @observable engineRunning = false
    @persist @observable doorsLocked = true
    @persist @observable energyCurrent = 0

    @persist isRegistered = false

    async trace(severity, action, code, message, description = "") {

        let date = moment()
        if (severity !== "debug") {

            let ue = {
                severity: severity,
                action: action,
                code: code,
                message: message,
                description: code === 0 ? { result: description } : { error: description },
                context: { key: this.key, doorsLocked: this.doorsLocked },
                performed_at: date.toDate()
            }

            if (await checkConnectivity()) {
                try {
                    await postToApi("/user_experiences", ue)
                } catch (error) {
                    console.log("exportPendingUserExperiences failed", error)
                }
            } else {
                this.userExperiences.push(ue);
            }
            this.otaLog = date.format("HH:mm:ss") + " " + severity + " " + message + '\n' + this.otaLog
        }

        console.log(date.format("HH:mm:ss") + " " + severity + " " + action + " " + message)
    }



    computeActionEnableKey(actions, onPress) {
        if (!driveStore.inUse || this.isKeyEnabled) { return }
        actions.push({ style: this.key && this.key.isEnabled ? actionStyles.DONE : actionStyles.TODO, icon: icons.KEY, onPress: onPress })
    }

    computeActionConnect(actions, onPress) {
        if (!driveStore.inUse) { return }
        actions.push({ style: this.isConnecting || this.isConnected ? actionStyles.DISABLE : actionStyles.TODO, icon: icons.CONNECT, onPress: onPress })
    }

    computeActionUnlock(actions, onPress) {
        if (!driveStore.inUse) { return }
        actions.push({ style: this.isKeyEnabled ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.UNLOCK, onPress: onPress })
    }
    computeActionLock(actions, onPress) {
        if (!driveStore.inUse) { return }
        actions.push({ style: this.isKeyEnabled ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.LOCK, onPress: onPress })
    }
    computeActionStart(actions, onPress) {
        if (!driveStore.inUse) { return }
        actions.push({ style: this.key ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.START, onPress: onPress })
    }
    computeActionStop(actions, onPress) {
        if (!driveStore.inUse) { return }
        actions.push({ style: this.key ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.STOP, onPress: onPress })
    }


    @action
    onOtaVehicleDataUpdated = async (otaVehicleData) => {
        try {
            await this.trace("info", "onOtaVehicleDataUpdated", 0, `>> ${otaVehicleData.doorsLocked ? "LOCKED" : "UNLOCKED"} / ${otaVehicleData.engineRunning ? "STARTED" : "STOPPED"} / ${otaVehicleData.energyCurrent + "%"}`)

            this.doorsLocked = otaVehicleData.doorsLocked === true ? true : false
            this.engineRunning = otaVehicleData.engineRunning === true ? true : false
            this.energyCurrent = otaVehicleData.energyCurrent
        } catch (error) {
            await this.trace("error", "onOtaVehicleDataUpdated", 1, `>> exception`, error)
        }
    }

    @action
    onOtaActionPerformed = async (otaAction) => {
        try {
            await this.trace("info", "onOtaActionPerformed", 0, `>> ${otaAction.otaOperation} / ${otaAction.otaState}`)
        } catch (error) {
            await this.trace("error", "onOtaActionPerformed", 1, `>> exception`, error)
        }
    }

    @action
    onOtaBluetoothStateChanged = async (otaBluetoothState) => {
        try {
            await this.trace("info", "onOtaBluetoothStateChanged", 0, `>> ${otaBluetoothState.newBluetoothState}`)
            if (otaBluetoothState.newBluetoothState === 'CONNECTED') {
                this.isConnected = true
                this.isConnecting = false
            } else if (otaBluetoothState.newBluetoothState === 'DISCONNECTED') {
                this.isConnected = false
                this.isConnecting = false
            } else {
                this.isConnected = false
                this.isConnecting = true
            }

        } catch (error) {
            await this.trace("error", "onOtaBluetoothStateChanged", 1, `>> exception`, error)
        }
    }

    @action
    async register(showError = true): Promise<boolean> {

        if (this.isRegistered) {
            return false
        }


        try {
            await this.trace("debug", "register", 0, `-> this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}, ${String(showError)}) start`)
            let result = await this.ota.register(this.keyAccessDeviceRegistrationNumber)

            DeviceEventEmitter.addListener('onOtaVehicleDataUpdated', this.onOtaVehicleDataUpdated);
            DeviceEventEmitter.addListener('onOtaActionPerformed', this.onOtaActionPerformed);
            DeviceEventEmitter.addListener('onOtaBluetoothStateChanged', this.onOtaBluetoothStateChanged);

            await this.trace("debug", "registerToOTA", 0, `<- this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}, ${String(showError)}) return ${result}`, result)

            this.isRegistered = true

            return result
        } catch (error) {
            await this.trace("debug", "registerToOTA", 1, `<- this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @action
    async getKeyAccessDeviceIdentifier(force: boolean = false, showError = true): Promise<string> {
        try {
            await this.trace("debug", "getOTAKeyAccessDeviceIdentifier", 0, `-> this.ota.getAccessDeviceToken(${String(force)}, ${String(showError)}) start`)
            this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(force)
            await this.trace("debug", "getOTAKeyAccessDeviceIdentifier", 0, `<- this.ota.getAccessDeviceToken(${String(force)}, ${String(showError)}) return ${this.keyAccessDeviceIdentifier}`)
        } catch (error) {
            await this.trace("debug", "getOTAKeyAccessDeviceIdentifier", 1, `<- this.ota.getAccessDeviceToken(${String(force)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
        }
        return this.keyAccessDeviceIdentifier
    }

    @action
    async openSession(keyAccessDeviceToken: string, showError = true): Promise<boolean> {

        if (!keyAccessDeviceToken || !keyAccessDeviceToken instanceof String || keyAccessDeviceToken === "") {
            return false
        }

        try {
            this.keyAccessDeviceToken = keyAccessDeviceToken
            await this.trace("debug", "openOTASession", 0, `-> this.ota.openSession(${this.keyAccessDeviceToken}, ${String(showError)}) start`)
            let result = await this.ota.openSession(keyAccessDeviceToken)
            await this.trace("info", "openOTASession", 0, `<- this.ota.openSession(${this.keyAccessDeviceToken}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "openOTASession", 1, `<- this.ota.openSession(${this.keyAccessDeviceToken}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }


    @action
    async getVehicleData(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "getVehicleData", 0, `-> this.ota.getVehicleData( ${String(showError)}) start`)
            let result = await this.ota.getVehicleData()
            await this.trace("info", "getVehicleData", 0, `<- this.ota.getVehicleData( ${String(showError)}) return ${JSON.stringify(result)}`, result)
            return result
        } catch (error) {
            await this.trace("error", "getVehicleData", 1, `<- this.ota.getVehicleData( ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }


    @action
    async getKey(keyId: string, showError = true): Promise<boolean> {

        if (!keyId || !keyId instanceof String || keyId === "") {
            return false
        }

        try {
            await this.trace("debug", "getKey", 0, `-> this.ota.getKey(${keyId}, ${String(showError)}) start`)
            this.key = await this.ota.getKey(keyId)
            await this.trace("info", "getKey", 0, `<- this.ota.getKey(${keyId}, ${String(showError)}) return ${JSON.stringify(this.key)}`, this.key)
            return true
        } catch (error) {
            await this.trace("error", "getKey", 1, `<- this.ota.getKey(${keyId}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @action
    async getUsedKey(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "getUsedKey", 0, `-> this.ota.getUsedKey( ${String(showError)}) start`)
            this.key = await this.ota.getUsedKey()
            await this.trace("info", "getUsedKey", 0, `<- this.ota.getUsedKey( ${String(showError)}) return ${JSON.stringify(this.key)}`, this.key)
            return true
        } catch (error) {
            await this.trace("error", "getUsedKey", 1, `<- this.ota.getUsedKey( ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @computed get isKeyEnabled() {
        return this.key && driveStore.rental && this.key.keyId === driveStore.rental.key_id && this.key.isEnabled
    }

    @action
    async enableKey(keyId: string, showError = true): Promise<boolean> {

        if (!keyId || !keyId instanceof String || keyId === "") {
            return false
        }

        try {
            await this.trace("debug", "enableKey", 0, `-> this.ota.enableKey(${keyId}, ${String(showError)}) start`)
            this.key = await this.ota.enableKey(keyId)
            await this.trace("info", "enableKey", 0, `<- this.ota.enableKey(${keyId}, ${String(showError)}) return ${JSON.stringify(this.key)}`, this.key)
            return true
        } catch (error) {
            await this.trace("error", "enableKey", 1, `<- this.ota.enableKey(${keyId}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @action
    async endKey(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "endKey", 0, `-> this.ota.endKey(${this.key.keyId}, ${String(showError)}) start`)
            this.key = await this.ota.endKey(this.key.keyId)
            await this.trace("info", "endKey", 0, `<- this.ota.endKey(${this.key.keyId}, ${String(showError)}) return ${JSON.stringify(this.key)}`, this.key)
            return true
        } catch (error) {
            await this.trace("error", "endKey", 1, `<- this.ota.endKey(${this.key.keyId}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @action
    async switchToKey(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "switchToKey", 0, `-> this.ota.switchToKey(${JSON.stringify(this.key)}, ${String(showError)}) start`)
            this.key = await this.ota.switchToKey()
            await this.trace("info", "switchToKey", 0, `<- this.ota.switchToKey(${JSON.stringify(this.key)}, ${String(showError)}) return ${JSON.stringify(this.key)}`, this.key)
            return true
        } catch (error) {
            await this.trace("error", "switchToKey", 1, `<- this.ota.switchToKey(${JSON.stringify(this.key)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }

    @action
    async syncVehicleData(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "syncVehicleData", 0, `-> this.ota.syncVehicleData( ${String(showError)}) start`)
            let result = await this.ota.syncVehicleData()
            await this.trace("info", "syncVehicleData", 0, `<- this.ota.syncVehicleData( ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "syncVehicleData", 1, `<- this.ota.syncVehicleData( ${String(showError)}) failed ${error}`, error)
            this.handleOTAAPIError(error, showError)
            return false
        }
    }


    //BLE actions

    @action
    async configureNetworkTimeouts(connectTimeout: Number, readTimeout: Number, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "configureOTANetworkTimeouts", 0, `-> this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}, ${String(showError)}) start`)
            let result = await this.ota.configureNetworkTimeouts(connectTimeout, readTimeout)
            await this.trace("info", "configureOTANetworkTimeouts", 0, `<- this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "configureOTANetworkTimeouts", 1, `<- this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    @action
    async isConnectedToVehicle(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "isConnectedToVehicle", 0, `-> this.ota.isConnectedToVehicle( ${String(showError)}) start`)
            let result = await this.ota.isConnectedToVehicle()
            await this.trace("info", "isConnectedToVehicle", 0, `<- this.ota.isConnectedToVehicle( ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "isConnectedToVehicle", 1, `<- this.ota.isConnectedToVehicle( ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    @action
    async isOperationInProgress(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "isOTAOperationInProgress", 0, `-> this.ota.isOperationInProgress( ${String(showError)}) start`)
            let result = await this.ota.isOperationInProgress()
            await this.trace("info", "isOTAOperationInProgress", 0, `<- this.ota.isOperationInProgress( ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "isOTAOperationInProgress", 1, `<- this.ota.isOperationInProgress( ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }


    @action
    async getBluetoothState(showError = true): Promise<string> {

        try {
            await this.trace("debug", "getBluetoothState", 0, `-> this.ota.getBluetoothState( ${String(showError)}) start`)
            let result = await this.ota.getBluetoothState()
            await this.trace("info", "getBluetoothState", 0, `<- this.ota.getBluetoothState( ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "getBluetoothState", 1, `<- this.ota.getBluetoothState( ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return "UNKNOWN"
        }
    }


    @action
    async connect(showNotification = false, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "connectToVehicle", 0, `-> this.ota.connect(${String(showNotification)}, ${String(showError)}) start`)
            let result = await this.ota.connect(showNotification)
            await this.trace("info", "connectToVehicle", 0, `<- this.ota.connect(${String(showNotification)}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            if (error.code = 'ALREADY_CONNECTED') return true

            await this.trace("error", "connectToVehicle", 1, `<- this.ota.connect(${String(showNotification)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }


    @action
    async disconnect(showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "disconnectFromVehicle", 0, `-> this.ota.disconnect( ${String(showError)}) start`)
            let result = await this.ota.disconnect()
            await this.trace("info", "disconnectFromVehicle", 0, `<- this.ota.disconnect( ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "disconnectFromVehicle", 1, `<- this.ota.disconnect( ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    @action
    async unlockDoors(requestVehicleData: boolean = false, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "unlockDoors", 0, `-> this.ota.unlockDoors(${String(requestVehicleData)}, ${String(showError)}) start`)
            let result = await this.ota.unlockDoors(requestVehicleData, true)
            await this.trace("info", "unlockDoors", 0, `<- this.ota.unlockDoors(${String(requestVehicleData)},  ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "unlockDoors", 1, `<- this.ota.unlockDoors(${String(requestVehicleData)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    @action
    async lockDoors(requestVehicleData: boolean = false, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "lockDoors", 0, `-> this.ota.lockDoors(${String(requestVehicleData)}, ${String(showError)},) start`)
            let result = await this.ota.lockDoors(requestVehicleData)
            await this.trace("info", "lockDoors", 0, `<- this.ota.lockDoors(${String(requestVehicleData)}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "lockDoors", 1, `<- this.ota.lockDoors(${String(requestVehicleData)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }


    @action
    async enableEngine(requestVehicleData: boolean = false, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "enableEngine", 0, `-> this.ota.enableEngine(${String(requestVehicleData)}, ${String(showError)}) start`)
            let result = await this.ota.enableEngine(requestVehicleData)
            await this.trace("info", "enableEngine", 0, `<- this.ota.enableEngine(${String(requestVehicleData)}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "enableEngine", 1, `<- this.ota.enableEngine(${String(requestVehicleData)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    @action
    async disableEngine(requestVehicleData: boolean = false, showError = true): Promise<boolean> {

        try {
            await this.trace("debug", "disableEngine", 0, `-> this.ota.disableEngine(${String(requestVehicleData)}, ${String(showError)}) start`)
            let result = await this.ota.disableEngine(requestVehicleData)
            await this.trace("info", "disableEngine", 0, `<- this.ota.disableEngine(${String(requestVehicleData)}, ${String(showError)}) return ${result}`, result)
            return result
        } catch (error) {
            await this.trace("error", "disableEngine", 1, `<- this.ota.disableEngine(${String(requestVehicleData)}, ${String(showError)}) failed ${error}`, error)
            this.handleOTABLEError(error, showError)
            return false
        }
    }

    handleOTAAPIError(error, showError) {

        if (!showError) return

        let code = error.code
        let message = error.message

        //Show error to user
        showToastError(code, message)
    }

    handleOTABLEError(error, showError) {

        if (!showError) return

        let code = error.code
        let message = error.message

        if (code === 'ALREADY_CONNECTED') return

        //Show error to user
        showToastError(code, message)
    }

}

export default new OTAKeyStore();
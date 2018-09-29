// @flow  
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { observable, action } from 'mobx';
import moment from 'moment';
import { driveStore } from '.';
import { actionStyles, icons } from '../utils/global';

const RENTAL_STATUS = {
    CONFIRMED: 'confirmed',
    ONGOING: 'ongoing',
    CLOSED: 'closed',
}

class Vehicle {
    @observable vin: String;
    @observable otaExtId: String;
    @observable otaId: Number;
    @observable model: String;
    @observable brand: String;
    @observable plate: String;
    @observable isEnabled: boolean;
}


class Key {
    @observable beginDate: Moment;
    @observable endDate: Moment;
    @observable mileageLimit: Number;
    @observable vehicle: Vehicle = new Vehicle;
    @observable keyId: Number;
    @observable extId: String;
    @observable isEnabled: boolean;
    @observable isUsed: boolean;
    @observable keyArgs: String;
    @observable keySensitiveArgs: String;
}

class VehicleData {
    @observable engineRunning: boolean;
    @observable doorsLocked: boolean;
    @observable energyCurrent: Number;

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
        this.register()
    }

    keyAccessDeviceRegistrationNumber = 970101

    ota = NativeModules.OTAKeyModule
    keyAccessDeviceRegistrationNumber: Number
    keyAccessDeviceIdentifier: string
    keyAccessDeviceToken: string

    @observable otaLog: string = ""

    @observable key: Key = new Key
    @observable vehicleData = null

    @observable isConnecting = false
    @observable isConnected = false

    debug(message: string): void {
        let date = moment()
        console.log(date.format("HH:mm:ss:SSS") + message)
        this.otaLog = date.format("HH:mm:ss:SSS") + message + '\n' + this.otaLog
    }


    computeActionEnableKey(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || (this.key && this.key.isEnabled)) { return }
        actions.push({ style: this.key && this.key.isEnabled ? actionStyles.DONE : actionStyles.TODO, icon: icons.KEY, onPress: onPress })
    }

    computeActionConnect(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || !this.key || !this.key.isEnabled || this.isConnected) { return }
        actions.push({ style: this.isConnecting ? actionStyles.DISABLE : actionStyles.TODO, icon: icons.CONNECT, onPress: onPress })
    }

    computeActionUnlock(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || !this.key) { return }
        actions.push({ style: this.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.UNLOCK, onPress: onPress })
    }
    computeActionLock(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || !this.key) { return }
        actions.push({ style: this.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.LOCK, onPress: onPress })
    }
    computeActionStart(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || !this.key || !this.key.isEnabled || !this.isConnected) { return }
        actions.push({ style: this.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.START, onPress: onPress })
    }
    computeActionStop(actions, onPress) {
        if (!driveStore.rental || driveStore.rental.status !== RENTAL_STATUS.ONGOING || !driveStore.rental.contract_signed || !driveStore.rental.key_id || !this.key || !this.key.isEnabled || !this.isConnected) { return }
        actions.push({ style: this.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE, icon: icons.STOP, onPress: onPress })
    }


    @action
    onOtaVehicleDataUpdated = (otaVehicleData) => {
        try {
            this.debug(`>>onOtaVehicleDataUpdated ${otaVehicleData.doorsLocked ? "LOCKED" : "UNLOCKED"} / ${otaVehicleData.engineRunning ? "STARTED" : "STOPPED"} / ${otaVehicleData.energyCurrent + "%"}`)
            if (!this.vehicleData) {
                this.vehicleData = new VehicleData
            }
            this.vehicleData.doorsLocked = otaVehicleData.doorsLocked
            this.vehicleData.engineRunning = otaVehicleData.engineRunning
            this.vehicleData.energyCurrent = otaVehicleData.energyCurrent
        } catch (error) {
            console.error(error)
        }
    }

    @action
    onOtaActionPerformed = (otaAction) => {
        try {
            this.debug(`>>onOtaActionPerformed ${otaAction.otaOperation} / ${otaAction.otaState}`)
        } catch (error) {
            console.error(error)
        }
    }

    @action
    onOtaBluetoothStateChanged = async (otaBluetoothState) => {
        try {
            this.debug(`>>onOtaBluetoothStateChanged" ${otaBluetoothState.newBluetoothState}`)
            if (otaBluetoothState.newBluetoothState === 'CONNECTED') {
                this.isConnected = true
                this.isConnecting = false
                await this.getVehicleData()
            } else if (otaBluetoothState.newBluetoothState === 'DISCONNECTED') {
                this.isConnected = false
                this.isConnecting = false
            } else {
                this.isConnected = false
                this.isConnecting = true
            }
            /*                 09-21 14:07:48.786 18013 18078 I ReactNativeJS: 'onOtaBluetoothStateChanged', 'SCANNING'
                            09-21 14:07:49.736 18013 18078 I ReactNativeJS: 'onOtaBluetoothStateChanged', 'DISCONNECTED'
                            09-21 14:07:49.737 18013 18078 I ReactNativeJS: 'onOtaBluetoothStateChanged', 'CONNECTING'
                            09-21 14:07:51.130 18013 18078 I ReactNativeJS: 'onOtaBluetoothStateChanged', 'CONNECTED'
             */
        } catch (error) {
            console.error(error)
        }
    }

    @action
    async register(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}) start`)
            let result = await this.ota.register(this.keyAccessDeviceRegistrationNumber)

            DeviceEventEmitter.addListener('onOtaVehicleDataUpdated', this.onOtaVehicleDataUpdated);
            DeviceEventEmitter.addListener('onOtaActionPerformed', this.onOtaActionPerformed);
            DeviceEventEmitter.addListener('onOtaBluetoothStateChanged', this.onOtaBluetoothStateChanged);
            /*
                        if (this.isConnectedToVehicle()) {
                            this.isConnected = true
                            await this.getVehicleData()
                        }*/

            this.debug(`<- this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.register(${String(this.keyAccessDeviceRegistrationNumber)}) failed ${error}`)
            return false
        }
    }

    @action
    async getKeyAccessDeviceIdentifier(force: boolean = false): Promise<string> {
        try {
            this.debug(`-> this.ota.getAccessDeviceToken(${String(force)}) start`)
            this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(force)
            this.debug(`<- this.ota.getAccessDeviceToken(${String(force)}) return ${this.keyAccessDeviceIdentifier}`)
        } catch (error) {
            this.debug(`<- this.ota.getAccessDeviceToken(${String(force)}) failed ${error}`)
        }
        return this.keyAccessDeviceIdentifier
    }

    @action
    async openSession(keyAccessDeviceToken: string): Promise<boolean> {

        try {
            this.keyAccessDeviceToken = keyAccessDeviceToken
            this.debug(`-> this.ota.openSession(${this.keyAccessDeviceToken}) start`)
            let result = await this.ota.openSession(keyAccessDeviceToken)
            this.debug(`<- this.ota.openSession(${this.keyAccessDeviceToken}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.openSession(${this.keyAccessDeviceToken}) failed ${error}`)
            return false
        }
    }

    @action
    async getVehicleData(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.getVehicleData() start`)
            let result = await this.ota.getVehicleData()
            this.debug(`<- this.ota.getVehicleData() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.getVehicleData() failed ${error}`)
            return false
        }
    }

    @action
    async getKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.getKey(${keyId}) start`)
            this.key = await this.ota.getKey(keyId)
            this.debug(`<- this.ota.getKey(${keyId}) return ${this.key}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.getKey(${keyId}) failed ${error}`)
            return false
        }
    }

    @action
    async getUsedKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.getUsedKey(${keyId}) start`)
            this.key = await this.ota.getUsedKey(keyId)
            this.debug(`<- this.ota.getUsedKey(${keyId}) return ${JSON.stringify(this.key)}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.getUsedKey(${keyId}) failed ${error}`)
            return false
        }
    }

    @action
    async enableKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.enableKey(${keyId}) start`)
            this.key = await this.ota.enableKey(keyId)
            this.debug(`<- this.ota.enableKey(${keyId}) return ${JSON.stringify(this.key)}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.enableKey(${keyId}) failed ${error}`)
            return false
        }
    }

    @action
    async endKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.endKey(${keyId}) start`)
            this.key = await this.ota.endKey(keyId)
            this.debug(`<- this.ota.endKey(${keyId}) return ${this.key}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.endKey(${keyId}) failed ${error}`)
            return false
        }
    }

    @action
    async switchToKey(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.switchToKey(${String(this.key)}) start`)
            this.key = await this.ota.endKey(this.key)
            this.debug(`<- this.ota.switchToKey(${String(this.key)}) return ${String(this.key)}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.switchToKey(${String(this.key)}) failed ${error}`)
            return false
        }
    }

    @action
    async syncVehicleData(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.syncVehicleData() start`)
            let result = await this.ota.syncVehicleData()
            this.debug(`<- this.ota.syncVehicleData() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.syncVehicleData() failed ${error}`)
            return false
        }
    }


    @action
    async configureNetworkTimeouts(connectTimeout: Number, readTimeout: Number): Promise<boolean> {

        try {
            this.debug(`-> this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}) start`)
            let result = await this.ota.configureNetworkTimeouts(connectTimeout, readTimeout)
            this.debug(`<- this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.configureNetworkTimeouts(${String(connectTimeout)}, ${String(readTimeout)}) failed ${error}`)
            return false
        }
    }

    async isConnectedToVehicle(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.isConnectedToVehicle() start`)
            let result = await this.ota.isConnectedToVehicle()
            this.debug(`<- this.ota.isConnectedToVehicle() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.isConnectedToVehicle() failed ${error}`)
            return false
        }
    }

    async isOperationInProgress(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.isOperationInProgress() start`)
            let result = await this.ota.isOperationInProgress()
            this.debug(`<- this.ota.isOperationInProgress() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.isOperationInProgress() failed ${error}`)
            return false
        }
    }


    async getBluetoothState(): Promise<string> {

        try {
            this.debug(`-> this.ota.getBluetoothState() start`)
            let result = await this.ota.getBluetoothState()
            this.debug(`<- this.ota.getBluetoothState() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.getBluetoothState() failed ${error}`)
            return "UNKNOWN"
        }
    }

    async connect(showNotification: boolean): Promise<boolean> {

        try {
            this.debug(`-> this.ota.connect(${String(showNotification)}) start`)
            let result = await this.ota.connect(showNotification)
            this.debug(`<- this.ota.connect(${String(showNotification)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.connect(${String(showNotification)}) failed ${error}`)
            return false
        }
    }


    async disconnect(): Promise<boolean> {

        try {
            this.debug(`-> this.ota.disconnect() start`)
            let result = await this.ota.disconnect()
            this.debug(`<- this.ota.disconnect() return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.disconnect() failed ${error}`)
            return false
        }
    }

    async unlockDoors(requestVehicleData: boolean): Promise<boolean> {

        try {

            //if(this.key)



            this.debug(`-> this.ota.unlockDoors(${String(requestVehicleData)}) start`)
            let result = await this.ota.unlockDoors(requestVehicleData, true)
            this.debug(`<- this.ota.unlockDoors(${String(requestVehicleData)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.unlockDoors(${String(requestVehicleData)}) failed ${error}`)
            return false
        }
    }

    async lockDoors(requestVehicleData: boolean): Promise<boolean> {

        try {
            this.debug(`-> this.ota.lockDoors(${String(requestVehicleData)}) start`)
            let result = await this.ota.lockDoors(requestVehicleData)
            this.debug(`<- this.ota.lockDoors(${String(requestVehicleData)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.lockDoors(${String(requestVehicleData)}) failed ${error}`)
            return false
        }
    }


    async enableEngine(requestVehicleData: boolean): Promise<boolean> {

        try {
            this.debug(`-> this.ota.enableEngine(${String(requestVehicleData)}) start`)
            let result = await this.ota.enableEngine(requestVehicleData)
            this.debug(`<- this.ota.enableEngine(${String(requestVehicleData)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.enableEngine(${String(requestVehicleData)}) failed ${error}`)
            return false
        }
    }

    async disableEngine(requestVehicleData: boolean): Promise<boolean> {

        try {
            this.debug(`-> this.ota.disableEngine(${String(requestVehicleData)}) start`)
            let result = await this.ota.disableEngine(requestVehicleData)
            this.debug(`<- this.ota.disableEngine(${String(requestVehicleData)}) return ${result}`)
            return result
        } catch (error) {
            this.debug(`<- this.ota.disableEngine(${String(requestVehicleData)}) failed ${error}`)
            return false
        }
    }



}

export default new OTAKeyStore();
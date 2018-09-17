// @flow  
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { observable } from 'mobx';
import moment from 'moment';

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
    @observable otaId: Number;
    @observable extId: String;
    @observable isEnabled: boolean;
    @observable isUsed: boolean;
    @observable keyArgs: String;
    @observable keySensitiveArgs: String;
}

class VehicleData {
    @observable id: Number;
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
    @observable engineRunning: boolean;
    @observable doorsLocked: boolean;
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
}


class OTAKeyStore {


    constructor() {

        DeviceEventEmitter.addListener('onOtaVehicleDataUpdated', function (e: Event) {
            console.log("**********************onOtaVehicleDataUpdated", e)
        });
        DeviceEventEmitter.addListener('onOtaActionPerformed', function (e: Event) {
            console.log("**********************onOtaVehicleDataUpdated", e)
        });
        DeviceEventEmitter.addListener('onOtaBluetoothStateChanged', function (e: Event) {
            console.log("**********************onOtaVehicleDataUpdated", e)
        });
    }

    ota = NativeModules.OTAKeyModule
    keyAccessDeviceIdentifier: string
    keyAccessDeviceToken: string

    @observable otaLog: string = "OTA LOGS:"

    @observable key: Key = new Key
    @observable vehicleData = new VehicleData

    debug(message: string): void {
        this.otaLog = this.otaLog + '\n' + message
    }


    async getKeyAccessDeviceIdentifier(): Promise<string> {
        try {
            this.debug(`-> this.ota.getAccessDeviceToken(false) start`)
            this.keyAccessDeviceIdentifier = await this.ota.getAccessDeviceToken(false)
            this.debug(`<- this.ota.getAccessDeviceToken(false) return ${this.keyAccessDeviceIdentifier}`)
        } catch (error) {
            this.debug(`<- this.ota.getAccessDeviceToken(false) failed ${error}`)
        }
        return this.keyAccessDeviceIdentifier
    }

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

    async getUsedKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.getUsedKey(${keyId}) start`)
            this.key = await this.ota.getUsedKey(keyId)
            this.debug(`<- this.ota.getUsedKey(${keyId}) return ${this.key}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.getUsedKey(${keyId}) failed ${error}`)
            return false
        }
    }


    async enableKey(keyId: string): Promise<boolean> {

        try {
            this.debug(`-> this.ota.enableKey(${keyId}) start`)
            this.key = await this.ota.enableKey(keyId)
            this.debug(`<- this.ota.enableKey(${keyId}) return ${this.key}`)
            return true
        } catch (error) {
            this.debug(`<- this.ota.enableKey(${keyId}) failed ${error}`)
            return false
        }
    }

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
            this.debug(`-> this.ota.unlockDoors(${String(requestVehicleData)}) start`)
            let result = await this.ota.unlockDoors(requestVehicleData)
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
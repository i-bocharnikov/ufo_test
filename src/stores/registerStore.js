import { Platform } from 'react-native'
import { observable, computed, action } from 'mobx';
import DeviceInfo from 'react-native-device-info';
import { persist } from 'mobx-persist'
import uuid from "uuid";

import configurations from "../utils/configurations";
import { clearAuthenticationsFromStore, getAuthenticationUUIDFromStore, setAuthenticationUUIDInStore, setAuthenticationPasswordInStore, getAuthenticationPasswordFromStore, setAuthenticationTokenInStore } from "../utils/authentications"
import { useTokenInApi, postToApi, putToApi, downloadFromApi, uploadToApi } from '../utils/api'
import driveStore from './driveStore'

const USER_STATUS_REGISTERED = "registered"
const USER_STATUS_REGISTRATION_PENDING = "registration_pending"
const USER_STATUS_REGISTRATION_MISSING = "registration_missing"
const STATUS_MISSING = "missing"
const STATUS_NOT_VALIDATED = "not_validated"
const STATUS_VALIDATED = "validated"

class User {
    @persist @observable reference = null
    @persist @observable role = null
    @persist @observable status = null
    @persist @observable company_name = null
    @persist @observable first_name = null
    @persist @observable last_name = null
    @persist @observable phone_number = null
    @persist @observable phone_number_status = null
    @persist @observable email = null
    @persist @observable email_status = null
    @persist @observable address = null
    @persist @observable address_status = null
    @persist @observable registration_message = null
    @persist @observable identification_front_side_reference = null
    @persist @observable identification_back_side_reference = null
    @persist @observable driver_licence_front_side_reference = null
    @persist @observable driver_licence_back_side_reference = null
}


class registerStore {

    @persist('object', User) @observable user = new User

    @observable identificationFrontDocument = "loading"
    @observable identificationBackDocument = "loading"
    @observable driverLicenceFrontDocument = "loading"
    @observable driverLicenceBackDocument = "loading"

    acknowledge_uri = ""

    @computed get isConnected() {
        return this.user.status !== USER_STATUS_REGISTRATION_MISSING
    }

    @computed get isUserRegistered() {
        return this.user.status === USER_STATUS_REGISTERED
    }

    @computed get isUserRegistrationInProgress() {
        return this.user.status === USER_STATUS_REGISTRATION_PENDING
    }

    @computed get isUserRegistrationMissing() {
        return this.user.status === USER_STATUS_REGISTRATION_MISSING
    }

    isStatusMissing(status) {
        return status === STATUS_MISSING
    }

    isStatusNotValidated(status) {
        return status === STATUS_NOT_VALIDATED
    }

    isStatusValidated(status) {
        return status === STATUS_VALIDATED
    }

    @action
    async registerDevice() {

        let device_uuid = await getAuthenticationUUIDFromStore();
        let device_pwd = await getAuthenticationPasswordFromStore();
        let isNew = false;
        if (!device_uuid) {
            device_uuid = uuid.v4();
            device_pwd = device_uuid;
            isNew = true;
        }

        let body = {
            uuid: device_uuid,
            password: device_pwd,
            type: Platform.OS === 'ios' ? 'ios' : 'android',
            customer_app_name: await DeviceInfo.getBundleId(),
            customer_app_version: configurations.UFO_APP_VERSION,
            customer_app_build_number: configurations.UFO_APP_BUILD_NUMBER,
            server_api_version: configurations.UFO_SERVER_API_VERSION,
            system_name: await DeviceInfo.getSystemName(),
            system_version: await DeviceInfo.getSystemVersion(),
            model: await DeviceInfo.getModel(),
            name: await DeviceInfo.getDeviceName(),
            description: await DeviceInfo.getUserAgent()
        };
        const response = isNew
            ? await postToApi("/users/devices", body, true, true)
            : await putToApi(
                "/users/devices/" + device_uuid,
                body, true, true
            );

        if (response && response.status === "success" && response.data && response.data.token && response.data.user) {
            console.info("registerStore.registerDevice:", response.data);
            await setAuthenticationUUIDInStore(device_uuid);
            await setAuthenticationPasswordInStore(device_pwd);
            await setAuthenticationTokenInStore(response.data.token);
            await useTokenInApi(response.data.token);
            this.user = response.data.user

            await driveStore.reset()

            return true
        }
        return false
    }

    @action
    async requestCode() {

        const response = await postToApi("/users/validation/phone_number/" + this.user.phone_number, {});
        if (response && response.status === "success" && response.data && response.data.notification) {
            console.info("registerStore.requestCode:", response.data);
            this.acknowledge_uri = response.data.notification.acknowledge_uri
            return true
        }
        return false
    };

    @action
    async connect(code) {

        const response = await postToApi("/" + this.acknowledge_uri, { validation_code: code });
        if (response && response.status === "success") {
            console.info("registerStore.connect:", response.data);
            return await this.registerDevice()
        }
        return false

    };

    @action
    async disconnect() {

        //TODO add logout service on server so we can unmap device and user in place of recreating new device
        await clearAuthenticationsFromStore();
        this.identificationFrontDocument = null
        this.identificationBackDocument = null
        this.driverLicenceFrontDocument = null
        this.driverLicenceBackDocument = null
        return await this.registerDevice()
    };

    @action
    async save() {

        const response = await putToApi("/users/" + this.user.reference, { ...this.user });
        if (response && response.status === "success") {
            console.info("registerStore.save:", response.data);
            this.user = response.data.user
            return true
        }
        return false
    };


    async downloadDocument(reference) {

        return await downloadFromApi(reference, false);
    };


    async uploadDocument(domain, format, type, sub_type, uri) {

        const response = await uploadToApi(domain, format, type, sub_type, uri);
        if (response && response.status === "success") {
            console.info("registerStore.uploadDocument:", response.data);
            return response.data.document
        }
        return null
    };
}

export default registerStore = new registerStore();




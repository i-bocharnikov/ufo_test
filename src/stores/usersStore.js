import { Platform } from 'react-native'
import { observable } from 'mobx';
import DeviceInfo from 'react-native-device-info';
import { persist } from 'mobx-persist'
import uuid from "uuid";

import configurations from "../utils/configurations";
import { getAuthenticationUUIDFromStore, setAuthenticationUUIDInStore, setAuthenticationPasswordInStore, getAuthenticationPasswordFromStore, setAuthenticationTokenInStore } from "../utils/authentications"
import { useTokenInApi, postToApi, putToApi } from '../utils/api'


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
}


class UsersStore {

    @persist('object', User) @observable user = new User

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

        if (response && response.status === "success") {
            console.info("usersStore.registerDevice : %j", response);
            await setAuthenticationUUIDInStore(device_uuid);
            await setAuthenticationPasswordInStore(device_pwd);
            await setAuthenticationTokenInStore(response.data.token);
            await useTokenInApi(response.data.token);
            this.user = response.data.user
        }
    }
}

export default usersStore = new UsersStore();


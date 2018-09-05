import { Platform } from 'react-native'
import { observable } from 'mobx';
import DeviceInfo from 'react-native-device-info';
import { persist } from 'mobx-persist'
import uuid from "uuid";

import { hydrate } from '../utils/store'
import configurations from "../utils/configurations";
import { getAuthenticationUUIDFromStore, setAuthenticationUUIDInStore, setAuthenticationPasswordInStore, getAuthenticationPasswordFromStore, setAuthenticationTokenInStore } from "../utils/authentications"
import { useTokenInApi, postToApi, putToApi } from '../utils/api'


class User {
    @persist @observable reference = null
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
        console.info("usersStore.registerDevice before: %s", await DeviceInfo.getModel());
        console.info("usersStore.registerDevice before: %s", this.user.reference);
        const response = isNew
            ? await postToApi("/users/devices", body, true, true)
            : await putToApi(
                "/users/devices/" + device_uuid,
                body, true, true
            );
        await setAuthenticationUUIDInStore(device_uuid);
        await setAuthenticationPasswordInStore(device_pwd);
        await setAuthenticationTokenInStore(response.token);
        await useTokenInApi(response.token);

        //await setUserForSupport(response.data.data.user);
        this.user = response.user
        console.info("usersStore.registerDevice after: %s", this.user.reference);

    }


}

export default usersStore = new UsersStore();
hydrate('users', usersStore).then(() => console.log('usersStore hydrated'))

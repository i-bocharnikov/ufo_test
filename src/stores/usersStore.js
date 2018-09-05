import { observable } from 'mobx';
import { Alert } from 'react-native';
import { Toast } from 'native-base'
import { persist } from 'mobx-persist'
import uuid from "uuid";

import { hydrate } from '../utils/store'
import configurations from "../utils/configurations";
import { getAuthenticationUUID, setAuthenticationUUID, setAuthenticationPassword, getAuthenticationPassword, setAuthenticationToken } from "../utils/authentications"
import { ufodrive_server_api, ufodrive_server_public_api, formatApiError } from '../utils/api'


class User {
    @persist @observable reference = null
}


class UsersStore {

    @persist('object', User) @observable user = new User

    async registerDevice() {
        try {
            let device_uuid = await getAuthenticationUUID();
            let device_pwd = await getAuthenticationPassword();
            let isNew = false;
            if (!device_uuid) {
                // @ts-ignore
                device_uuid = uuid.v4();
                device_pwd = device_uuid;
                isNew = true;
            }

            let body = {
                uuid: device_uuid,
                password: device_pwd,
                type: "web",
                customer_app_name: configurations.UFO_APP_NAME,
                customer_app_version: configurations.UFO_APP_VERSION,
                customer_app_build_number: configurations.UFO_APP_BUILD_NUMBER,
                server_api_version: configurations.UFO_SERVER_API_VERSION
            };
            console.log("Service.connectService before: %s", this.user.reference);
            const response = isNew
                ? await ufodrive_server_public_api.post("/users/devices", body)
                : await ufodrive_server_public_api.put(
                    "/users/devices/" + device_uuid,
                    body
                );
            await setAuthenticationUUID(device_uuid);
            await setAuthenticationPassword(device_pwd);
            ufodrive_server_api.defaults.headers.common["Authorization"] = "Bearer " + response.data.data.token;
            ufodrive_server_api.defaults.headers.post["Authorization"] = "Bearer " + response.data.data.token;
            await setAuthenticationToken(response.data.data.token);

            //await setUserForSupport(response.data.data.user);
            this.user = response.data.data.user
            console.log("Service.connectService after: %s", this.user.reference);
        } catch (error) {
            //addAnalyticsError(error);
            console.log("Service.connectService error: %j", error);
            let formattedError = formatApiError(error);
            console.log("Service.connectService user error: %j", formattedError);
            //            Alert.alert('Connection error', formattedError.error.text);
            console.log("Service.connectService after: %s", this.user.reference);
            Toast.show({
                text: formattedError.error.text
            })
        }
    }


}

export default usersStore = new UsersStore();
hydrate('users', usersStore).then(() => console.log('usersStore hydrated'))

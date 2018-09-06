import axios from "axios";
import moment from "moment";
import uuid from "uuid";
import _ from "lodash"
import Config from "./config";

//import { addAnalyticsError } from "./Analytics";
//import { setUserForSupport } from "./Support";

const DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm"
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD"

const ufodrive_server_public_api = axios.create({
    baseURL:
        Config.UFO_SERVER_API_URL +
        "public/api/" +
        Config.UFO_SERVER_API_VERSION +
        "/",
    timeout: 60000
});

const ufodrive_server_api = axios.create({
    baseURL:
        Config.UFO_SERVER_API_URL + "api/" + Config.UFO_SERVER_API_VERSION + "/",
    timeout: 60000
});

export const connectService = async () => {
    try {
        let device_uuid = localStorage.getItem("uuid");
        let device_pwd = localStorage.getItem("pwd");
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
            customer_app_name: Config.UFO_APP_NAME,
            customer_app_version: Config.UFO_APP_VERSION,
            customer_app_build_number: Config.UFO_APP_BUILD_NUMBER,
            server_api_version: Config.UFO_SERVER_API_VERSION
        };
        const response = isNew
            ? await ufodrive_server_public_api.post("/users/devices", body)
            : await ufodrive_server_public_api.put(
                "/users/devices/" + device_uuid,
                body
            );
        localStorage.setItem("uuid", device_uuid);
        localStorage.setItem("pwd", device_pwd);
        ufodrive_server_api.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.data.token;
        ufodrive_server_api.defaults.headers.post["Authorization"] =
            "Bearer " + response.data.data.token;
        localStorage.setItem("token", response.data.data.token);

        //await setUserForSupport(response.data.data.user);

        return { status: true, uuid: device_uuid, user: response.data.data.user };
    } catch (error) {
        //addAnalyticsError(error);
        console.log("Service.connectService error: %s", error);
        return await formatError(error);
    }
};

/**
 * LOGIN
 *
 */

export const checkLogin = async () => {
    try {
        const result = await ufodrive_server_api.get("users/myself");
        const checkedUser = result.data.data.user;
        console.log(
            "Service.checkLogin for phone_number %s return user %s",
            checkedUser.reference
        );
        return { status: true, user: checkedUser };
    } catch (error) {
        //addAnalyticsError(error);
        console.log("Service.checkLogin error: %s", error);
        return await formatError(error);
    }
};

export const askLogin = async phone_number => {
    try {
        const result = await ufodrive_server_api.post(
            "/users/validation/phone_number/" + phone_number,
            {}
        );
        const notification = result.data.data.notification;
        console.log(
            "Service.askLogin for phone_number %s return notification %s",
            phone_number,
            notification.reference
        );
        return { status: true, notification: notification };
    } catch (error) {
        //addAnalyticsError(error);
        console.log("Service.askLogin error: %s", error);
        return await formatError(error);
    }
};

export const doLogin = async (code, acknowledge_uri) => {
    try {
        await ufodrive_server_api.post(acknowledge_uri, {
            validation_code: code
        });
        return await connectService();
    } catch (error) {
        //addAnalyticsError(error);
        console.log("Service.doLogin error: %s", error);
        return await formatError(error);
    }
};

export const doLogout = async () => {
    try {
        localStorage.removeItem("uuid");
        localStorage.removeItem("pwd");
        localStorage.removeItem("token");
        return await connectService();
    } catch (error) {
        //addAnalyticsError(error);
        console.log("Service.doLogout error: %s", error);
        return await formatError(error);
    }
};



/**
 *
 * COMMON
 *
 */

const formatError = async error => {
    let key = "api";
    let message = error.message;
    if (
        error.response &&
        error.response.data &&
        error.response.data.data &&
        error.response.data.data.message
    ) {
        message = error.response.data.data.message;
        key = error.response.status ? error.response.status : "api";
        if (key === "401") {
            message =
                "We detect connectivity issues, press refresh button on your browser to reload the page";
        }
    } else {
        if (message === "Network Error") {
            message =
                "We detect connection issues, press refresh button on your browser to reload the page";
        }
    }

    return { status: false, error: { key: key, text: message } };
};

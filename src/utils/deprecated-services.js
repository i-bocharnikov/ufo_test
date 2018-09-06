import axios from "axios";
import moment from "moment";
import uuid from "uuid";
import _ from "lodash"
import Config from "./config";

//import { addAnalyticsError } from "./Analytics";
//import { setUserForSupport } from "./Support";

const DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm"
const DEFAULT_DATE_FORMAT = "YYYY-MM-DD"


/**
 * LOGIN
 *
 
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
} */

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

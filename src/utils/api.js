import axios from "axios";
import configurations from "../utils/configurations"

export const ufodrive_server_public_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_URL +
        "public/api/" +
        configurations.UFO_SERVER_API_VERSION +
        "/",
    timeout: 60000
});

export const ufodrive_server_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_URL + "api/" + configurations.UFO_SERVER_API_VERSION + "/",
    timeout: 60000
});


export function formatApiError(error) {
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
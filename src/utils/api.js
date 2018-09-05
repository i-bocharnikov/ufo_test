import axios from "axios";
import configurations from "../utils/configurations"
import activitiesStore from '../stores/activitiesStore'

export const ufodrive_server_connectivity_test_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_URL,
    timeout: 500
});

export const ufodrive_server_public_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_URL +
        "public/api/" +
        configurations.UFO_SERVER_API_VERSION +
        "/",
    timeout: 10000
});

export const ufodrive_server_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_URL + "api/" + configurations.UFO_SERVER_API_VERSION + "/",
    timeout: 10000
});

export async function useTokenInApi(token) {
    ufodrive_server_api.defaults.headers.common["Authorization"] = "Bearer " + token;
    ufodrive_server_api.defaults.headers.post["Authorization"] = "Bearer " + token;
}

/**
 * GET a path relative to API root url.
 * @param {String}  path Relative path to the configured API endpoint
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise} of response body
 */
export async function getFromApi(path, suppressToastBox = false, usePublicApi = false) {

    let api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api
    try {
        activitiesStore.internetAccessPending = true
        let response = await api.get(path)
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = false
        return response.data
    } catch (error) {
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = true
        handleError(error, suppressToastBox)
    }
}

/**
 * POST JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function postToApi(path, body, suppressToastBox = false, usePublicApi = false) {
    let api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api
    try {
        activitiesStore.internetAccessPending = true
        let response = await api.post(path, body)
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = false
        return response.data
    } catch (error) {
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = true
        handleError(error, suppressToastBox)
    }
}

/**
 * PUT JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function putToApi(path, body, suppressToastBox = false, usePublicApi = false) {
    let api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api
    try {
        activitiesStore.internetAccessPending = true
        let response = await api.put(path, body)
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = false
        return response.data
    } catch (error) {
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = true
        handleError(error, suppressToastBox)
    }
}

export async function checkConnectivity() {

    try {
        activitiesStore.internetAccessPending = true
        await ufodrive_server_connectivity_test_api.get("/")
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = false
        return true
    } catch (error) {
        activitiesStore.internetAccessPending = false
        activitiesStore.internetAccessFailure = true
        return false
    }
}

function handleError(error, suppressToastBox) {
    let ufoError = formatApiError(error);
    console.warn("api.get error: %s", ufoError.message);
    console.debug("api.get error.stack: %j", error);
    if (!suppressToastBox) {
        Toast.show({
            text: ufoError.message,
            duration: 3000,
            buttonText: "Okay",
        })
    }
}


function formatApiError(error) {
    let key = "api";
    let message = error.message;
    if (
        error.response &&
        error.response.data &&
        error.response.data &&
        error.response.data.message
    ) {
        message = error.response.data.message;
        key = error.response.status ? error.response.status : "api";
        if (key === "401") {
            message =
                "We detect connectivity issues, please reload the application";
        }
    } else {
        if (message === "Network Error") {
            message =
                "We detect connection issues, please reload the application";
        }
    }

    return { code: key, message: message };
};
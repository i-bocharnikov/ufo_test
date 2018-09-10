import axios from "axios";
import configurations from "../utils/configurations"
import activitiesStore from '../stores/activitiesStore'
import { Toast, } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob'

const SAVE_TOKEN = null
export const ufodrive_server_connectivity_test_api = axios.create({
    baseURL:
        configurations.UFO_SERVER_API_BASE_URL,
    timeout: 300
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
    SAVE_TOKEN = token
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
        if (!await checkConnectivity()) {
            throw new Error("No internet access")
        }
        activitiesStore.activities.internetAccessPending = true
        let response = await api.get(path)
        activitiesStore.activities.internetAccessPending = false
        return response.data
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
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
        if (!await checkConnectivity()) {
            throw new Error("No internet access")
        }
        activitiesStore.activities.internetAccessPending = true
        let response = await api.post(path, body)
        activitiesStore.activities.internetAccessPending = false
        return response.data
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
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
        if (!await checkConnectivity()) {
            throw new Error("No internet access")
        }
        activitiesStore.activities.internetAccessPending = true
        let response = await api.put(path, body)
        activitiesStore.activities.internetAccessPending = false
        return response.data
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
        handleError(error, suppressToastBox)
    }
}

/**
 * UPLOAD JSON to a path relative to API root url
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function uploadToApi(domain, format, type, sub_type, uri, suppressToastBox = false) {
    try {
        if (!await checkConnectivity()) {
            throw new Error("No internet access")
        }
        let fileType = "image/jpeg"
        let fileName = domain + sub_type + ".jpg"

        const data = new FormData();
        data.append('document', {
            uri: uri,
            type: fileType,
            name: fileName
        });
        data.append('domain', domain)
        data.append('format', format)
        data.append('type', type)
        data.append('sub_type', sub_type)
        data.append('file_name', fileName)
        data.append('content_type', fileType)
        activitiesStore.activities.internetAccessPending = true
        let response = await ufodrive_server_api.post("documents", data, {
            headers: {
                'Content-Type': 'multipart/form-data;',
            }
        })
        activitiesStore.activities.internetAccessPending = false
        return response.data
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
        handleError(error, suppressToastBox)
    }
}

/**
 * DOWNLOAD JSON to a path relative to API root url
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function downloadFromApi(reference, thumbnail = true, suppressToastBox = false) {
    try {
        if (!await checkConnectivity()) {
            throw new Error("No internet access")
        }
        activitiesStore.activities.internetAccessPending = true
        let path = thumbnail ? "thumbnail/" : "documents/"
        let url = configurations.UFO_SERVER_API_URL + "api/" + configurations.UFO_SERVER_API_VERSION + "/" + path + reference
        console.log("***********url", url)
        console.log("***********Token", SAVE_TOKEN)
        let response = await RNFetchBlob.fetch('GET', url, {
            Authorization: 'Bearer ' + SAVE_TOKEN,
        })
        let base64Str = response.base64()
        activitiesStore.activities.internetAccessPending = false
        console.log("********downloadFromApi", base64Str)

        return base64Str
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
        handleError(error, suppressToastBox)
    }
}

export async function checkConnectivity() {

    try {
        activitiesStore.activities.internetAccessPending = true
        await ufodrive_server_connectivity_test_api.get("/")
        activitiesStore.activities.internetAccessPending = false
        activitiesStore.activities.internetAccessFailure = false
        return true
    } catch (error) {
        activitiesStore.activities.internetAccessPending = false
        activitiesStore.activities.internetAccessFailure = true
        return false
    }
}

function handleError(error, suppressToastBox) {
    let ufoError = formatApiError(error);
    //console.warn("api.get error: %s", ufoError.message);
    console.debug("api.get error.stack: %j", error);
    if (!suppressToastBox) {
        Toast.show({
            text: ufoError.message,
            buttonText: 'Ok',
            type: "danger",
            duration: 5000,
            buttonTextStyle: { color: "#008000" },
            buttonStyle: { backgroundColor: "#5cb85c" }
        });
    }
}


function formatApiError(error) {
    let key = "api";
    let message = error.message;
    if (
        error.response &&
        error.response.data &&
        error.response.data.data &&
        error.response.data.data.message
    ) {
        message = error.response.data.data.message;
        key = error.response.data.status ? error.response.data.status : "api";
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
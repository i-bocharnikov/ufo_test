import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

import configurations from '../utils/configurations';
import { errors, UFOError } from '../utils/global';
import { activitiesStore } from '../stores';
import { showToastError } from './interaction';
import i18n from './i18n';

export let SAVE_TOKEN = null;

export const ufodrive_server_connectivity_test_api = axios.create({
  baseURL: `${configurations.UFO_SERVER_PUBLIC_API_URL}v1/`,
  timeout: 1000
});

export const ufodrive_server_public_api = axios.create({
  baseURL: `${configurations.UFO_SERVER_PUBLIC_API_URL}v1/`,
  timeout: 30000
});

export const ufodrive_server_api = axios.create({
  baseURL: `${configurations.UFO_SERVER_PRIVATE_API_URL}v1/`,
  timeout: 30000
});

export const ufodrive_server_log_api = axios.create({
  baseURL: `${configurations.UFO_SERVER_PRIVATE_API_URL}v1/`,
  timeout: 1000
});

export async function useTokenInApi(token) {
  SAVE_TOKEN = token;
  ufodrive_server_api.defaults.headers.common.Authorization = 'Bearer ' + token;
  ufodrive_server_api.defaults.headers.post.Authorization = 'Bearer ' + token;

  ufodrive_server_log_api.defaults.headers.common.Authorization =
    'Bearer ' + token;
  ufodrive_server_log_api.defaults.headers.post.Authorization =
    'Bearer ' + token;
}

/**
 * GET a path relative to API root url.
 * @param {String}  path Relative path to the configured API endpoint
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise} of response body
 */
export async function getFromApi(
  path,
  suppressToastBox = false,
  usePublicApi = false
) {
  const api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api;
  try {
    await activitiesStore.activities.registerInternetStart();
    const response = await api.get(path);
    await activitiesStore.activities.registerInternetStopSuccess();
    return response.data;
  } catch (error) {
    handleError(error, suppressToastBox);
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
export async function postToApi(
  path,
  body,
  suppressToastBox = false,
  usePublicApi = false
) {
  const api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api;
  try {
    await activitiesStore.activities.registerInternetStart();
    const response = await api.post(path, body);
    await activitiesStore.activities.registerInternetStopSuccess();
    return response.data;
  } catch (error) {
    handleError(error, suppressToastBox);
  }
}

export async function logToApi(path, body) {
  await ufodrive_server_log_api.post(path, body);
  return;
}

/**
 * PUT JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function putToApi(
  path,
  body,
  suppressToastBox = false,
  usePublicApi = false
) {
  const api = usePublicApi ? ufodrive_server_public_api : ufodrive_server_api;
  try {
    await activitiesStore.activities.registerInternetStart();
    const response = await api.put(path, body);
    await activitiesStore.activities.registerInternetStopSuccess();
    return response.data;
  } catch (error) {
    handleError(error, suppressToastBox);
  }
}

/**
 * UPLOAD JSON to a path relative to API root url
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function uploadToApi(
  domain,
  format,
  type,
  sub_type,
  uri,
  suppressToastBox = false
) {
  try {
    if (!(await checkConnectivity())) {
      throw errors.INTERNET_CONNECTION_REQUIRED;
    }
    const fileType = 'image/jpeg';
    const fileName = domain + sub_type + '.jpg';

    const data = new FormData();
    data.append('document', {
      uri: uri,
      type: fileType,
      name: fileName
    });
    data.append('domain', domain);
    data.append('format', format);
    data.append('type', type);
    data.append('sub_type', sub_type);
    data.append('file_name', fileName);
    data.append('content_type', fileType);
    await activitiesStore.activities.registerInternetStart();
    const response = await ufodrive_server_api.post('documents', data, {
      headers: { 'Content-Type': 'multipart/form-data;' }
    });
    await activitiesStore.activities.registerInternetStopSuccess();
    return response.data;
  } catch (error) {
    handleError(error, suppressToastBox);
  }
}

/**
 * DOWNLOAD JSON to a path relative to API root url
 * @param {Boolean} suppressToastBox If true, no warning is shown on failed request
 * @param {Boolean} usePublicApi If true, use th epublic api
 * @returns {Promise}  of response body
 */
export async function downloadFromApi(
  reference,
  thumbnail = true,
  suppressToastBox = false
) {
  try {
    if (!(await checkConnectivity())) {
      throw errors.INTERNET_CONNECTION_REQUIRED;
    }

    const path = thumbnail ? 'thumbnail/' : 'documents/';
    const url = `${configurations.UFO_SERVER_API_URL}api/${
      configurations.UFO_SERVER_DEPRECATED_API_VERSION
    }/${path}${reference}`;

    await activitiesStore.activities.registerInternetStart();
    const response = await RNFetchBlob.fetch('GET', url, {
      Authorization: 'Bearer ' + SAVE_TOKEN
    });
    const base64Str = response.base64();
    await activitiesStore.activities.registerInternetStopSuccess();

    return base64Str;
  } catch (error) {
    handleError(error, suppressToastBox);
  }
}

export async function checkConnectivity() {
  try {
    await activitiesStore.activities.registerInternetStart();
    await ufodrive_server_connectivity_test_api.get('/');
    await activitiesStore.activities.registerInternetStopSuccess();
    return true;
  } catch (error) {
    await activitiesStore.activities.registerInternetStopFailure();
    return false;
  }
}

async function handleError(error, suppressToastBox) {
  const ufoError = formatApiError(error);
  console.debug('api throw error: ', ufoError);
  if (!suppressToastBox) {
    showToastError(ufoError.message);
  }
  if (ufoError.key !== 400 && ufoError.key !== 500 && !suppressToastBox) {
    await activitiesStore.activities.registerInternetStopFailure();
  } else {
    await activitiesStore.activities.registerInternetStopSuccess();
  }
}

function formatApiError(error) {
  if (error instanceof UFOError) {
    return { key: error.i18nKey, message: error.i18nValue };
  }
  let key = 'error:api';
  let message = error.message;
  console.debug('format error: ', error.response);

  if (
    error.response &&
    error.response.data &&
    error.response.data.data &&
    error.response.data.data.message
  ) {
    console.debug('format error: ', error.response);

    message = error.response.data.data.message;
    key = error.response.status
      ? error.response.status
      : error.response.data.status
      ? error.response.data.status
      : 'api';
  }

  if (message === 'Network Error') {
    return {
      key: 'error:internetConnectionRequired',
      message: i18n.t('error:connectivityIssue')
    };
  }

  return { key: key, message: message };
}

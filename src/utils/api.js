import axios from 'axios';

import i18n from './i18n';
import configs from './../utils/configurations';
import { showToastError } from './interaction';

const ufoServerPrivateApi = axios.create({
  headers: { 'Accept-Language': i18n.language },
  baseURL: `${configs.UFO_SERVER_PRIVATE_API_URL}${configs.UFO_SERVER_API_VERSION}/`,
  timeout: 30000
});

const ufoServerPublicApi = axios.create({
  headers: { 'Accept-Language': i18n.language },
  baseURL: `${configs.UFO_SERVER_PUBLIC_API_URL}${configs.UFO_SERVER_API_VERSION}/`,
  timeout: 30000
});

/**
  * @param {Object} error
  * @description Show toast as default api error handler
  */
function defaultErrorHandler(error) {
  __DEV__ && console.info(error);
  const message = getErrorMessage(error);
  /*
   * use small timeout to avoid this bug https://github.com/facebook/react-native/issues/10471
   * because almost all requests are handling with ModalLoader indicator
  */
  setTimeout(() => showToastError(message), 300);
}

function formatResponse(axiosRes, isSuccess = true) {
  return {
    isSuccess,
    data: isSuccess ? axiosRes.data : axiosRes
  };
}

/**
  * @param {Object} errorObj
  * @returns {string}
  * @description Get error as string
  */
export function getErrorMessage(errorObj) {
  let errorMsg = null;

  if (
    errorObj.response
    && errorObj.response.data
    && typeof errorObj.response.data === 'object'
  ) {
    const { data } = errorObj.response;
    errorMsg = data.message || Object.values(data)[0].toString();
  }

  return errorMsg || errorObj.message || i18n.t('error:unknown');
}

/*
 * @param {string} token
 * @description Save auth token to using it in api headers
*/
export async function setAuthTokenForApi(token) {
  if (token) {
    ufoServerPrivateApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

/**
  * @param {string} path
  * @returns {boolean} errorHandling
  * @returns {boolean} usePublicApi
  * @description Make GET request to server api
  */
export async function getFromApi(path, errorHandling = false, usePublicApi = false) {
  try {
    const api = usePublicApi ? ufoServerPublicApi : ufoServerPrivateApi;
    const response = await api.get(path);

    return formatResponse(response);
  } catch (error) {
    if (errorHandling) {
      defaultErrorHandler(error);
    }

    return formatResponse(error, false);
  }
}

/**
  * @param {string} path
  * @param {Object} body
  * @returns {boolean} errorHandling
  * @returns {boolean} usePublicApi
  * @description Make POST request to server api
  */
export async function postToApi(path, body, errorHandling = false, usePublicApi = false) {
  try {
    const api = usePublicApi ? ufoServerPublicApi : ufoServerPrivateApi;
    const response = await api.post(path, body);

    return formatResponse(response);
  } catch (error) {
    if (errorHandling) {
      defaultErrorHandler(error);
    }

    return formatResponse(error, false);
  }
}

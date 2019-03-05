import axios from 'axios';
import _ from 'lodash';

import i18n from './i18n';
import configs from './../utils/configurations';
import { showToastError } from './interaction';

const ufoServerPrivateApi = createApi(false, configs.UFO_SERVER_API_VERSION);
const ufoServerPublicApi = createApi(true, configs.UFO_SERVER_API_VERSION);

/**
  * @param {String} apiType
  * @param {String} apiVersion
  * @description Show toast as default api error handler
  */
function createApi(isPublicApi, apiVersion) {
  return axios.create({
    headers: { 'Accept-Language': i18n.language },
    baseURL: `${isPublicApi ? configs.UFO_SERVER_PUBLIC_API_URL : configs.UFO_SERVER_PRIVATE_API_URL}${apiVersion}/`,
    timeout: 30000
  });
}

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

/**
  * @param {Object} axiosRes
  * @param {boolean} isSuccess
  * @description Create standard response object
  */
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

  // axios error about connectivity
  if (errorObj.message === 'Network Error') {
    return i18n.t('error:connectivityIssue');
  }

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
    ufoServerPrivateApi.defaults.headers.common.Authorization = `Bearer ${token}`;
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
  * @param {boolean} errorHandling
  * @param {boolean} usePublicApi
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

/**
  * @param {string} path
  * @param {Object} body
  * @param {boolean} errorHandling
  * @param {boolean} usePublicApi
  * @param {string} apiVersion
  * @description Make PUT request to server api
  */
export async function putToApi(path, body, errorHandling = false, usePublicApi = false, apiVersion) {
  try {
    let api;

    if (apiVersion) {
      api = createApi(usePublicApi, apiVersion);
    } else {
      api = usePublicApi ? ufoServerPublicApi : ufoServerPrivateApi;
    }

    const response = await api.put(path, body);
    return formatResponse(response);
  } catch (error) {
    if (errorHandling) {
      defaultErrorHandler(error);
    }

    return formatResponse(error, false);
  }
}

/**
  * @returns {boolean}
  * @description Check, is connecting to api present
  */
export async function checkServerAvailability() {
  try {
    await ufoServerPublicApi.get('/');

    return true;
  } catch (error) {
    return false;
  }
}

/**
  * @param {string} fileUri
  * @param {Function} progressListener
  * @returns {Object} formData
  * @returns {boolean} errorHandling
  * @returns {string} apiVersion
  * @description Upload file with form data and listen progress
  */
export async function uploadToApiWithProgress(
  fileUri,
  progressListener,
  /* domain, format, type, sub_type, path */
  formData = {},
  errorHandling = false,
  apiVersion = configs.UFO_SERVER_DEPRECATED_API_VERSION
) {
  try {
    // using one percent to show loading start
    let percentCompleted = 1;
    const fileOriginName = _.trimEnd(fileUri, '/');
    const fileType = 'image/jpeg';

    const fileName = (domain && sub_type) ? `${domain}${sub_type}.jpg` : fileOriginName;
    const { domain, format, type, sub_type } = formData;

    const path = formData.path || 'documents';
    const api = createApi(false, apiVersion);
    const data = new FormData();

    data.append('file_name', fileName);
    data.append('content_type', fileType);
    data.append('document', {
      uri: fileUri,
      type: fileType,
      name: fileName
    });

    if (domain) {
      data.append('domain', domain);
    }

    if (format) {
      data.append('format', format);
    }

    if (type) {
      data.append('type', type);
    }

    if (sub_type) {
      data.append('sub_type', sub_type);
    }

    progressListener(percentCompleted);
    const response = await api.post(path, data, {
      /* request config */
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: progressEvent => {
        percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );

        if (percentCompleted > 0) {
          progressListener(percentCompleted);
        }
      }
    });

    // if request finished progress should be full
    if (percentCompleted !== 100) {
      percentCompleted = 100;
      progressListener(percentCompleted);
    }

    return formatResponse(response.data || response);
  } catch (error) {
    progressListener(0);

    if (errorHandling) {
      defaultErrorHandler(error);
    }

    return formatResponse(error, false);
  }
}

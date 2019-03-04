import { Platform } from 'react-native';
import { observable, computed, action } from 'mobx';
import { persist } from 'mobx-persist';
import DeviceInfo from 'react-native-device-info';
import uuid from 'uuid';
import { parsePhoneNumber } from 'libphonenumber-js';
import _ from 'lodash';

import configurations from './../utils/configurations';
import {
  clearAuthenticationsFromStore,
  getAuthenticationUUIDFromStore,
  setAuthenticationUUIDInStore,
  setAuthenticationPasswordInStore,
  getAuthenticationPasswordFromStore,
  setAuthenticationTokenInStore,
  getAuthenticationTokenFromStore
} from './../utils/authentications';
import {
  useTokenInApi as useTokenInApi_deprecated,
  postToApi,
  putToApi,
  downloadFromApi,
  uploadToApi,
  getFromApi
} from './../utils/api_deprecated';
import { setAuthTokenForApi } from './../utils/api';

const USER_STATUSES = {
  REGISTERED: 'registered',
  REGISTRATION_PENDING: 'registration_pending',
  REGISTRATION_MISSING: 'registration_missing',
  MISSING: 'missing',
  NOT_VALIDATED: 'not_validated',
  VALIDATED: 'validated',
  ADMIN: 'admin'
};

class User {
  @persist @observable reference = null;
  @persist @observable role = null;
  @persist @observable status = null;
  @persist @observable first_name = null;
  @persist @observable last_name = null;
  @persist @observable phone_number = null;
  @persist @observable phone_number_status = null;
  @persist @observable email = null;
  @persist @observable email_status = null;
  @persist @observable address = null;
  @persist @observable address_status = null;
  @persist @observable registration_message = null;
  @persist @observable identification_front_side_reference = null;
  @persist @observable identification_back_side_reference = null;
  @persist @observable driver_licence_front_side_reference = null;
  @persist @observable driver_licence_back_side_reference = null;
  @persist @observable miles_and_more = null;
  @persist @observable face_capture_required = false;
  @persist @observable company_name = null;
  @persist @observable vat_number = null;
  @persist @observable loyalty_balance_amount = null;
}

export default class RegisterStore {
  @persist('object', User) @observable user = new User();
  @persist supportChatIDKey = null;
  @observable idCardFrontScan = null;
  @observable idCardBackScan = null;
  @observable dlCardFrontScan = null;
  @observable dlCardBackScan = null;

  startupMessage = null;
  acknowledgeUri = '';

  /*
   * @description Get user full name
   */
  @computed
  get userFullName() {
    let name = '';

    if (this.user.first_name) {
      name += this.user.first_name;
    }

    if (this.user.last_name) {
      name += name ? ` ${this.user.last_name}` : this.user.last_name;
    }

    return name;
  }

  /*
   * @description Checking user status
   */
  @computed
  get isConnected() {
    return this.user.status !== USER_STATUSES.REGISTRATION_MISSING;
  }

  /*
   * @description Checking user status
   */
  @computed
  get isUserRegistered() {
    return this.user.status === USER_STATUSES.REGISTERED;
  }

  /*
   * @description Checking phone number
   */
  @computed
  get isCurrentPhoneValid() {
    try {
      const phone = _.get(this.user, 'phone_number');

      if (phone) {
        const phoneParsed = parsePhoneNumber(phone);
        return phoneParsed.isValid();
      }

      return false
    } catch (error) {
      return false;
    }
  }

  /*
   * @description Get credit amount string
   */
  @computed
  get creditAmountLabel() {
    return this.user.loyalty_balance_amount || '-';
  }

  /*
   * @description Get and save localy auth token
   */
  @action
  reuseToken = async () => {
    const token = await getAuthenticationTokenFromStore();
    await useTokenInApi_deprecated(token);
    await setAuthTokenForApi(token);
  }

  /*
   * @description Register device with identifier
   */
  @action
  registerDevice = async keyAccessDeviceIdentifier => {
    let device_uuid = await getAuthenticationUUIDFromStore();
    let device_pwd = await getAuthenticationPasswordFromStore();
    let isNew = false;

    if (!device_uuid) {
      device_uuid = uuid.v4();
      device_pwd = device_uuid;
      isNew = true;
    }

    const body = {
      uuid: device_uuid,
      password: device_pwd,
      key_access_device_identifier: keyAccessDeviceIdentifier,
      type: Platform.OS,
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

    const response = isNew
      ? await postToApi('/users/devices', body, true, true)
      : await putToApi(`/users/devices/${device_uuid}`, body, true, true);

    if (
      _.isMatch(response, { 'status': 'success' })
      && _.has(response, 'data.token')
      && _.has(response, 'data.user')
    ) {

      await setAuthenticationUUIDInStore(device_uuid);
      await setAuthenticationPasswordInStore(device_pwd);
      await setAuthenticationTokenInStore(response.data.token);
      await useTokenInApi_deprecated(response.data.token);
      await setAuthTokenForApi(response.data.token);

      this.user = response.data.user;
      this.supportChatIDKey = response.data.support_chat_identification_key;
      this.startupMessage = response.data.message;

      return response.data.key_access_device_token;
    }

    return null;
  }

  /*
   * @returns {boolean}
   * @description Request of sms for phone validation
   */
  @action
  requestSmsCode = async () => {
    const response = await postToApi(`/users/validation/phone_number/${this.user.phone_number}`);

    if ( response && response.status === 'success' && _.has(response, 'data.notification')) {
      this.acknowledgeUri = response.data.notification.acknowledge_uri;
      return true;
    }

    return false;
  }

  /*
   * @returns {boolean}
   * @description Confirm phone and login
   */
  @action
  connect = async code => {
    const response = await postToApi(`/${this.acknowledgeUri}`, { validation_code: code });
    return _.isMatch(response, { 'status': 'success' });
  }

  /*
   * @description Logout at device
   */
  @action
  disconnect = async () => {
    await clearAuthenticationsFromStore();
    this.idCardFrontScan = null;
    this.idCardBackScan = null;
    this.dlCardFrontScan = null;
    this.dlCardBackScan = null;
  }

  /*
   * @param {Object} extraData
   * @returns {boolean}
   * @description Save current local user data to server
   */
  @action
  save = async (extraData = {}) => {
    const response = await putToApi(`/users/${this.user.reference}`, {
      ...this.user,
      ...extraData
    });

    if (response && response.status === 'success' && _.has(response, 'data.user')) {
      this.user = response.data.user;
      return true;
    }

    return false;
  }

  /*
   * @param {string} domain
   * @param {string} format
   * @param {string} type
   * @param {string} sub_type
   * @param {string} uri
   * @returns {Object}
   * @description Upload document and get back object with document info
   */
  @action
  uploadDocument = async (domain, format, type, sub_type, uri) => {
    const response = await uploadToApi(domain, format, type, sub_type, uri);

    if (response && response.status === 'success') {
      return response.data.document;
    }

    return null;
  }

  /*
   * @returns {boolean}
   * @description Get current user data
   */
  @action
  getUserData = async () => {
    if (this.user.reference) {
      const response = await getFromApi(`/users/${this.user.reference}`);

      if (response && response.status === 'success') {
        this.user = response.data.user;
        return true;
      }
    }

    return false;
  };

  /*
   * @param {string} fileUri
   * @returns {boolean}
   * @description Upload face captured image and save new user data
   */
  @action
  uploadFaceCapture = async fileUri => {
    try {
      const uploadedFace = await this.uploadDocument(
        'identification',
        'one_side',
        'face_capture',
        'front_side',
        fileUri
      );

      const isSuccess = await this.save({
        identification_face_capture_reference: uploadedFace.reference
      });

      return isSuccess;
    } catch (error) {
      return false;
    }
  };

  /*
   * @description Get thumbs images about previous documents' scans
   */
  @action
  fetchScanDocumentThumbs = async () => {
    const idFrontScanRef = _.get(this.user, 'identification_scan_front_side.reference');
    const idBackScanRef = _.get(this.user, 'identification_scan_back_side.reference');
    const dlFrontScanRef = _.get(this.user, 'driver_licence_scan_front_side.reference');
    const dlBackScanRef = _.get(this.user, 'driver_licence_scan_back_side.reference');

    const loadThumbData = async (documentStoreName, documentRef) => {
      if (documentRef) {
        this[documentStoreName] = 'loading';
        const imgData = await downloadFromApi(documentRef, false);
        this[documentStoreName] = imgData ? `data:image/png;base64,${imgData}` : null;
      }
    };

    await Promise.all([
      loadThumbData('idCardFrontScan', idFrontScanRef),
      loadThumbData('idCardBackScan', idBackScanRef),
      loadThumbData('dlCardFrontScan', dlFrontScanRef),
      loadThumbData('dlCardBackScan', dlBackScanRef)
    ]);
  };
}

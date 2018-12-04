import _ from 'lodash';

import { getFromApi, postToApi } from './../../utils/api';

/**
  * @class
  * @property fallbackOrder
  * @description Class contain methods to work with booking api, orderModel (rental) section
  */
export default class Order {

  static fallbackOrder = null;
  static fallbackPaymentOptions = {};
  static fallbackOrderConfirmation = null;

  /**
    * @param {string} location
    * @param {string} car
    * @param {string} startDate
    * @param {string} endDate
    * @param {string} startTime
    * @param {string} endTime
    * @param {Object} options
    * @returns {Object}
    * @description Get simulation (object) of future order
    */
  static async getOrder(location, car, startDate, endDate, startTime, endTime, options = {}) {
    const {
      currency = 'EUR',
      voucherCode,
      useRefferal
    } = options;

    let path = `/reserve/bookings/${location}/${car}/${startDate}T${startTime}/${endDate}T${endTime}/${currency}`;

    if (voucherCode) {
      path = `${path}?voucherOrReferralCode=${voucherCode}`;
    }

    if (useRefferal) {
      path = `${path}${voucherCode ? '&' : '?'}referralAmountUsed=true`;
    }

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.booking')) {
      return response.data.booking;
    } else {
      return this.fallbackOrder;
    }
  }

  /**
   * @param {string} locationRef
   * @returns {Object}
   * @description Return object with available user's credit cards and public api key for stripe
  */
  static async getPaymentOptions(locationRef) {
    const path = `/reserve/userPaymentOptions/${locationRef}`;

    const response = await getFromApi(path, true);

    if (response.isSuccess) {
      return response.data;
    } else {
      return this.fallbackPaymentOptions;
    }
  }

  /**
   * @param {Object} payload
   * @returns {Object}
   * @description Send confirmation of booking for current order
  */
  static async confirmOrder(payload) {
    const response = await postToApi('/reserve/bookings', payload, true);

    if (response.isSuccess) {
      return response.data;
    } else {
      return this.fallbackOrderConfirmation;
    }
  }
}

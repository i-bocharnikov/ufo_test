import _ from 'lodash';

import { getFromApi } from './../../utils/api';

/**
  * @class
  * @property fallbackOrder
  * @description Class contain methods to work with booking api, orderModel (rental) section
  */
export default class Order {

  static fallbackOrder = null;
  static fallbackPaymentOptions = {};

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
      voucherCode
    } = options;

    let path = `/reserve/rentals/${location}/${car}/${startDate}T${startTime}/${endDate}T${endTime}/${currency}`;

    if (voucherCode) {
      path = `${path}?voucherOrReferralCode=${voucherCode}`;
    }

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.rental')) {
      return response.data.rental;
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
}

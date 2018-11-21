import _ from 'lodash';

import { getFromApi } from './../../utils/api';

/**
  * @class
  * @property fallbackOrder
  * @description Class contain methods to work with booking api, orderModel (rental) section
  */
export default class Order {

  static fallbackOrder = null;

  /**
    * @param {string} location
    * @param {string} car
    * @param {string} startDate
    * @param {string} endDate
    * @param {string} startTime
    * @param {string} endTime
    * @param {string} currency
    * @returns {Object}
    * @description Get simulation (object) of future order
    */
  static async getOrder(location, car, startDate, endDate, startTime, endTime, currency = 'EUR') {
    const path = `/reserve/rentals/${location}/${car}/${startDate}T${startTime}/${endDate}T${endTime}/${currency}`;

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.rental')) {
      return response.data.rental;
    } else {
      return this.fallbackOrder;
    }
  }
}

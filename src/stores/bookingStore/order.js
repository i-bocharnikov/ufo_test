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
    * @returns {Object}
    * @description Get simulation (object) of future order
    */
  static async getOrder(location, car, startDate, endDate, startTime, endTime) {
    const path = `/reserve/rentals/${location}/${car}/${startDate}T${startTime}/${endDate}T${endTime}/EUR`;

    const response = await getFromApi(path);

    if (_.has(response, 'rental.rental')) {
      return response.rental.rental;
    } else {
      return this.fallbackOrder;
    }
  }
}

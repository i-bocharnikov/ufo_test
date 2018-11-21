import _ from 'lodash';

import { getFromApi_v2 as getFromApi } from './../../utils/api_deprecated';

/**
  * @class
  * @property {Array} fallbackLocations
  * @description Class contain methods to work with booking api, locationModels section
  */
export default class Locations {

  static fallbackLocations = [];

  /**
    * @param {string} carRef
    * @returns {Array}
    * @description Get all available locations
    */
  static async getLocations(carRef) {
    const path = carRef
      ? `/reserve/locations?carModelReference=${carRef}`
      : '/reserve/locations';

    const response = await getFromApi(path);

    if (_.has(response, 'locations')) {
      return response.locations;
    } else {
      return this.fallbackLocations;
    }
  }
}

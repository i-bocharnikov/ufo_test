import _ from 'lodash';

import { getFromApi } from './../../utils/api';

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

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.locations')) {
      return response.data.locations;
    } else {
      return this.fallbackLocations;
    }
  }
}

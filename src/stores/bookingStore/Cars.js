import _ from 'lodash';

import { getFromApi } from './../../utils/api';

/**
  * @class
  * @property {Array} fallbackCars
  * @property fallbackCalendar
  * @property fallbackOrder
  * @description Class contain methods to work with booking api, carModels section
  */
export default class Cars {

  static fallbackCars = [];
  static fallbackCalendar = null;
  static fallbackOrder = null;
  static fallbackDescription = {};

  /**
    * @param {string} locationRef
    * @returns {Array}
    * @description Get all available cars
    */
  static async getCars(locationRef) {
     const path = locationRef
      ? `/reserve/carModels?locationReference=${locationRef}`
      : '/reserve/carModels';

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.carModels')) {
      return response.data.carModels;
    } else {
      return this.fallbackCars;
    }
  }

  /**
    * @param {string} location
    * @param {string} car
    * @param {string} minDate
    * @param {string} maxDate
    * @returns {Array}
    * @description Get calendar days with rental notes
    */
  static async getCarsCalendar(location, car, minDate, maxDate) {
    let path = `/reserve/carsCalendar/${location}/${car}`;

    if (minDate) {
      path = `${path}?minDate=${minDate}`;
    }

    if (maxDate) {
      path = `${path}${minDate ? '&' : '?'}maxDate=${maxDate}`;
    }

    const response = await getFromApi(path, true);

    if (response.isSuccess && _.has(response, 'data.carsCalendarDays')) {
      return response.data.carsCalendarDays;
    } else {
      return this.fallbackCalendar;
    }
  }

  /**
    * @param {string} carRef
    * @returns {Object}
    * @description Get description for specific car
    */
  static async getDescription(carRef) {
    const response = await getFromApi(`/reserve/carModels/${carRef}`, true);

    if (response.isSuccess && _.has(response, 'data.carModel')) {
      return response.data.carModel;
    } else {
      return this.fallbackDescription;
    }
  }
}

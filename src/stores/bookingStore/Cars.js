import _ from 'lodash';

import { getFromApi_v2 as getFromApi } from './../../utils/api';

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

  /**
    * @param {string} locationRef
    * @returns {Array}
    * @description Get all available cars
    */
  static async getCars(locationRef) {
     const path = locationRef
      ? `/reserve/carModels?locationReference=${locationRef}`
      : '/reserve/carModels';

    const response = await getFromApi(path);

    if (_.has(response, 'carModels')) {
      return response.carModels;
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

    const response = await getFromApi(path);

    if (_.has(response, 'carsCalendarDays')) {
      return response.carsCalendarDays;
    } else {
      return this.fallbackCalendar;
    }
  }
}

import _ from 'lodash';

import { getFromApi } from './../../utils/api';

export default class Order {

  static fallbackOrder = null;

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

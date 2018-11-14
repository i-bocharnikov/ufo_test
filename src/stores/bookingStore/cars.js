import { getFromApi } from './../../utils/api';

export default class Cars {

  static fallbackCars = [];
  static fallbackCalendar = null;
  static fallbackOrder = null;

  static async getCars(locationRef) {
     const path = locationRef
      ? `/reserve/carModels?locationReference=${locationRef}`
      : '/reserve/carModels';

    const response = await getFromApi(path);

    if (response && response.data && response.data.carModels) {
      return response.data.carModels;
    } else {
      return this.fallbackCars;
    }
  }

  static async getCarsCalendar(location, car) {
    const path = `/reserve/carsCalendar/${location}/${car}`;

    const response = await getFromApi(path);

    if (response && response.data && response.data.carsCalendarDays) {
      return response.data.carsCalendarDays;
    } else {
      return this.fallbackCalendar;
    }
  }

  static async getOrder(options) {
    const {
      location,
      car,
      startDate,
      endDate,
      startTime,
      endTime
    } = options;

    const path = `/reserve/rentals/${location}/${car}/${startDate}T${startTime}/${endDate}T${endTime}/EUR`;

    const response = await getFromApi(path);

    if (response && response.rental && response.rental.rental) {
      return response.rental.rental;
    } else {
      return this.fallbackOrder;
    }
  }
}

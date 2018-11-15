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

  static async getCarsCalendar(location, car, minDate, maxDate) {
    let path = `/reserve/carsCalendar/${location}/${car}`;

    if (minDate) {
      path = `${path}?minDate=${minDate}`;
    }

    if (maxDate) {
      path = `${path}${minDate ? '&' : '?'}maxDate=${maxDate}`;
    }

    const response = await getFromApi(path);

    if (response && response.data && response.data.carsCalendarDays) {
      return response.data.carsCalendarDays;
    } else {
      return this.fallbackCalendar;
    }
  }
}

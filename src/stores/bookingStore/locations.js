import { getFromApi } from './../../utils/api';

export default class Locations {

  static fallbackLocations = [];

  static async getLocations(carRef) {
    const path = carRef
      ? `/reserve/locations?carModelReference=${carRef}`
      : '/reserve/locations';

    const response = await getFromApi(path);

    if (response && response.data && response.data.locations) {
      return response.data.locations;
    } else {
      return this.fallbackLocations;
    }
  }
}

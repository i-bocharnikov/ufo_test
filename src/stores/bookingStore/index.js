import { observable, action, computed } from 'mobx';
import moment from 'moment';

import locations from './Locations';
import cars from './Cars';
import order from './Order';
import { getPreselectedDatesForRollPicker } from './helpers';
import { values } from './../../utils/theme';

const TODAY = moment().startOf('day');
const TOMORROW = moment().add(1, 'day').startOf('day');
const MAX_RENTAL_DATE = moment().add(3, 'y').startOf('day');

export default class BookingStore {

  @observable isLoading = false;

  /* step book */
  @observable order = null;
  @observable locations = [];
  @observable cars = [];
  @observable selectedLocationRef = null;
  @observable selectedCarRef = null;
  @observable carCalendar = null;

  @observable startRentalDate = TOMORROW;
  @observable endRentalDate = TOMORROW;
  @observable startRentalTime = moment(TOMORROW).add(8, 'h').format(values.TIME_STRING_FORMAT);
  @observable endRentalTime = moment(TOMORROW).add(20, 'h').format(values.TIME_STRING_FORMAT);

  /**
    * @description Get lists of all locations and cars
    */
  @action
  getInitialData = async () => {
    this.isLoading = true;

    const [ receivedLocations, receivedCars ] = await Promise.all([
      locations.getLocations(),
      cars.getCars()
    ]);

    this.locations = receivedLocations;
    this.cars = receivedCars;

    this.isLoading = false;
  };

  /**
    * @param {string} ref
    * @description select location for order
    */
  @action
  selectLocation = async ref => {
    const isSelectedNew = ref && this.selectedLocationRef !== ref;
    this.isLoading = true;

    if (isSelectedNew) {
      this.selectedLocationRef = ref;
      this.cars = await cars.getCars(ref);
    } else {
      this.selectedLocationRef = null;
      this.cars = await cars.getCars();
    }

    await Promise.all([
      this.getCarCalendar(),
      this.getOrderSimulation()
    ]);

    this.isLoading = false;
  };

  /**
    * @param {string} ref
    * @description Select car for order
    */
  @action
  selectCar = async ref => {
    const isSelectedNew = ref && this.selectedCarRef !== ref;
    this.isLoading = true;

    if (isSelectedNew) {
      this.selectedCarRef = ref;
      this.locations = await locations.getLocations(ref);
    } else {
      this.selectedCarRef = null;
      this.locations = await locations.getLocations();
    }

    await Promise.all([
      this.getCarCalendar(),
      this.getOrderSimulation()
    ]);

    this.isLoading = false;
  };

  /**
    * @param {Object} dateMoment
    * @description Set start rental date as 'moment' object
    */
  @action
  selectStartDate = async dateMoment => {
    if (dateMoment.isBefore(TOMORROW)) {
      this.startRentalDate = TOMORROW;
    } else {
      this.startRentalDate = dateMoment;
    }

    if (this.endRentalDate.isBefore(this.startRentalDate)) {
      this.endRentalDate = this.startRentalDate;
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @param {Object} dateMoment
    * @description Set end rental date as 'moment' object
    */
  @action
  selectEndDate = async dateMoment => {
    if (dateMoment.isBefore(TOMORROW)) {
      this.endRentalDate = TOMORROW;
    } else {
      this.endRentalDate = dateMoment;
    }

    if (this.startRentalDate.isAfter(this.endRentalDate)) {
      this.startRentalDate = this.endRentalDate;
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @param {Object} dateMomentStart
    * @param {Object} dateMomentEnd
    * @description Set dates with modal calendar component
    */
  @action
  selectCalendarDates = async (dateMomentStart, dateMomentEnd) => {
    this.startRentalDate = dateMomentStart;
    this.endRentalDate = dateMomentEnd;

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @param {string} timeStr
    * @description Set start rental time
    */
  @action
  selectStartTime = async timeStr => {
    this.startRentalTime = timeStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @param {string} timeStr
    * @description Set end rental time
    */
  @action
  selectEndTime = async timeStr => {
    this.endRentalTime = timeStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @description Get array of data for roll pickers (dates) rendering
    */
  @computed
  get rollPickersData() {
    if (!Array.isArray(this.carCalendar)) {
      return getPreselectedDatesForRollPicker();
    }

    return this.carCalendar.map(item => ({
      label: moment(item.calendarDay).format(values.DATE_ROLLPICKER_FORMAT),
      id: item.calendarDay,
      available: item.available
    }));
  }

  /**
    * @description Get selected row into picker for start date
    */
  @computed
  get rollPickerStartSelectedIndex() {
    return this.startRentalDate.diff(TODAY, 'days');
  }

  /**
    * @description Get selected row into picker for end date
    */
  @computed
  get rollPickerEndSelectedIndex() {
    return this.endRentalDate.diff(TODAY, 'days');
  }

  /**
    * @description Get formated string for price of current order
    */
  @computed
  get orderPrice() {
    if (!this.order) {
      return '-';
    }

    return `${this.order.price.amount}€`;
  }

  /**
    * @description Get array with unavailable dates
    */
  @computed
  get calendarPickerUnavailableMap() {
    const map = [];

    if (!Array.isArray(this.carCalendar)) {
      return map;
    }

    this.carCalendar.forEach(item => {
      if (!item.available) {
        map.push(item.calendarDay);
      }
    });

    return map;
  }

  /**
    * @description Get days with description for rental current car
    */
  getCarCalendar = async () => {
    if (!this.selectedLocationRef || !this.selectedCarRef) {
      this.carCalendar = null;
      return;
    }

    const minDate = moment().format(values.DATE_STRING_FORMAT);
    const maxDate = moment(MAX_RENTAL_DATE).format(values.DATE_STRING_FORMAT);

    this.carCalendar = await cars.getCarsCalendar(
      this.selectedLocationRef,
      this.selectedCarRef,
      minDate,
      maxDate
    );
  };

  /**
    * @description Get description how will looking the order
    */
  getOrderSimulation = async () => {
    if (!this.selectedLocationRef || !this.selectedCarRef) {
      this.order = null;
      return;
    }

    this.order = await order.getOrder(
      this.selectedLocationRef,
      this.selectedCarRef,
      this.startRentalDate.format(values.DATE_STRING_FORMAT),
      this.endRentalDate.format(values.DATE_STRING_FORMAT),
      this.startRentalTime,
      this.endRentalTime
    );
  };
}

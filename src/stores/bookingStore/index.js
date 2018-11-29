import { observable, action, computed } from 'mobx';
import moment from 'moment-timezone';
import _ from 'lodash';

import locations from './Locations';
import cars from './Cars';
import order from './Order';
import { getPreselectedDatesForRollPicker, getTimeItemsForRollPicker } from './helpers';
import { values } from './../../utils/theme';

// period in months
const MAX_RENTAL_PERIOD = 36;
const TODAY = moment().startOf('day');
const TOMORROW = moment().add(1, 'day').startOf('day');
const MAX_RENTAL_DATE = moment().add(MAX_RENTAL_PERIOD, 'month').startOf('day');

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

  @observable locationInfoRef = null;
  @observable carInfoRef = null;
  @observable locationInfoDescription = {};
  @observable carInfoDescription = {};

  @observable voucherCode = '';
  @observable stripeApiKey = null;
  @observable userCreditCards = [];
  @observable currentCreditCardRef = null;

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
  selectStartTime = async (timeStr, itemIndex) => {
    this.startRentalTime = timeStr;

    if (this.rollPickerEndSelectedTimeItem <= itemIndex) {
      const nextIndex = this.rollPickersTimeItems.length > itemIndex + 1
        ? itemIndex + 1
        : itemIndex;
      this.endRentalTime = this.rollPickersTimeItems[nextIndex].label;
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @param {string} timeStr
    * @description Set end rental time
    */
  @action
  selectEndTime = async (timeStr, itemIndex) => {
    this.endRentalTime = timeStr;

    if (this.rollPickerStartSelectedTimeItem >= itemIndex) {
      const prevIndex = itemIndex - 1 >= 0 ? itemIndex - 1 : itemIndex;
      this.startRentalTime = this.rollPickersTimeItems[prevIndex].label;
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
    * @description Get description for location or car
    */
  @action
  getDescriptionData = async () => {
    this.isLoading = true;

    if (this.locationInfoRef && this.locationInfoRef !== this.locationInfoDescription.reference) {
      this.locationInfoDescription = await locations.getDescription(this.locationInfoRef);
    }

    if (this.carInfoRef && this.carInfoRef !== this.carInfoDescription.reference) {
      this.carInfoDescription = await cars.getDescription(this.carInfoRef);
    }

    this.isLoading = false;
  };

  /**
    * @returns {boolean}
    * @description Get options for payment and return bool about is any option available
    */
  @action
  getUserPaymentOptions = async () => {
    if (!this.selectedLocationRef) {
      return false;
    }

    this.isLoading = true;
    const data = await order.getPaymentOptions(this.selectedLocationRef);
    this.stripeApiKey = data.paymentPublicApi;
    this.userCreditCards = data.userCreditCards;
    const defaultCard = _.find(this.userCreditCards, [ 'default', true ]);
    this.currentCreditCardRef = defaultCard ? defaultCard.reference : null;
    this.isLoading = false;

    return this.userCreditCards.length ? true : false;
  };

  /**
    * @description Get array of data for roll pickers (dates) rendering
    */
  @computed
  get rollPickersData() {
    if (!Array.isArray(this.carCalendar)) {
      return getPreselectedDatesForRollPicker(MAX_RENTAL_PERIOD);
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
    * @description Get array with times for choosing
    */
  @computed
  get rollPickersTimeItems() {
    return getTimeItemsForRollPicker();
  }

  /**
    * @description Get selected row into picker for start date
    */
  @computed
  get rollPickerStartSelectedTimeItem() {
    const index = _.findIndex(this.rollPickersTimeItems, item => item.label === this.startRentalTime);

    return index === -1 ? 0 : index;
  }

  /**
    * @description Get selected row into picker for end date
    */
  @computed
  get rollPickerEndSelectedTimeItem() {
    const index = _.findIndex(this.rollPickersTimeItems, item => item.label === this.endRentalTime);

    return index === -1 ? 0 : index;
  }

  /**
    * @description Show is current car and location data available for order
    */
  @computed
  get isOrderCarAvailable() {
    if (!_.has(this, 'order.carAvailabilities.status')) {
      return false;
    }

    return this.order.carAvailabilities.status === 'available';
  }

  /**
    * @description Get data for BookingDetailsScreen
    */
  @computed
  get infoDescription() {
    if (this.locationInfoRef && this.locationInfoRef === this.locationInfoDescription.reference) {
      return { isLocation: true, ...this.locationInfoDescription };
    }

    if (this.carInfoRef && this.carInfoRef === this.carInfoDescription.reference) {
      return { isCar: true, ...this.carInfoDescription };
    }

    return {};
  }

  /*
   *  @description Get start rental time for chosen location
  */
  @computed
  get rentalScheduleStart() {
    if (!_.has(this, 'order.schedule')) {
      return '';
    }

    const m = moment.utc(this.order.schedule.startAt);
    const dateStr = m.tz(this.order.schedule.timezone).format(values.DATE_ROLLPICKER_FORMAT);
    const timeStr = m.tz(this.order.schedule.timezone).format(values.TIME_STRING_FORMAT);

    return `${dateStr} (${timeStr})`;
  }

  /*
   *  @description Get end rental time for chosen location
  */
  @computed
  get rentalScheduleEnd() {
    if (!_.has(this, 'order.schedule')) {
      return '';
    }

    const m = moment.utc(this.order.schedule.endAt);
    const dateStr = m.tz(this.order.schedule.timezone).format(values.DATE_ROLLPICKER_FORMAT);
    const timeStr = m.tz(this.order.schedule.timezone).format(values.TIME_STRING_FORMAT);

    return `${dateStr} (${timeStr})`;
  }

  /**
    * @description Get max period for calender view settings
    */
  get maxRentalPeriodInMonths() {
    return MAX_RENTAL_PERIOD;
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

    const timeZone = _.find(this.locations, { 'reference': this.selectedLocationRef }).timezone;
    const startRentalTime = this.convertTimeToUTC(this.startRentalTime, timeZone);
    const endRentalTime = this.convertTimeToUTC(this.endRentalTime, timeZone);

    this.order = await order.getOrder(
      this.selectedLocationRef,
      this.selectedCarRef,
      this.startRentalDate.format(values.DATE_STRING_FORMAT),
      this.endRentalDate.format(values.DATE_STRING_FORMAT),
      startRentalTime,
      endRentalTime
    );
  };

  /**
    * @param {string} timeStr
    * @param {string} timeZoneStr
    * @returns {string}
    * @description Convert time from specified timeZome to UTC
    */
  convertTimeToUTC = (timeStr, timeZoneStr) => {
    const m = moment.tz(timeStr, values.TIME_STRING_FORMAT, timeZoneStr);
    return m.utc().format(values.TIME_STRING_FORMAT);
  };

  /**
    * @param {string} timeStr
    * @param {string} timeZoneStr
    * @returns {string}
    * @description Convert time from UTC to specified timeZome
    */
  convertTimeFromUTC = (timeStr, timeZoneStr) => {
    const m = moment.utc(timeStr, values.TIME_STRING_FORMAT);
    return m.tz(timeZoneStr).format(values.TIME_STRING_FORMAT);
  };
}

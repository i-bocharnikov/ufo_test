import { observable, action } from 'mobx';
import moment from 'moment';

import locations from './locations';
import cars from './cars';
import order from './order';
import { values } from './../../utils/theme';

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

  @observable startRentalDate = moment(TOMORROW).format(values.DATE_STRING_FORMAT);
  @observable endRentalDate = moment(TOMORROW).format(values.DATE_STRING_FORMAT);
  @observable startRentalTime = moment(TOMORROW).add(8, 'h').format(values.TIME_STRING_FORMAT);
  @observable endRentalTime = moment(TOMORROW).add(20, 'h').format(values.TIME_STRING_FORMAT);

  @action
  getInitialData = async () => {
    this.isLoading = true;

    const [l, c] = await Promise.all([
      locations.getLocations(),
      cars.getCars()
    ]);

    this.locations = l;
    this.cars = c;

    this.isLoading = false;
  };

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

  @action
  selectStartDate = async dateStr => {
    this.startRentalDate = dateStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  @action
  selectEndDate = async dateStr => {
    this.endRentalDate = dateStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  @action
  selectStartTime = async timeStr => {
    this.startRentalTime = timeStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  @action
  selectEndTime = async timeStr => {
    this.endRentalTime = timeStr;
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

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

  getOrderSimulation = async () => {
    if (!this.selectedLocationRef || !this.selectedCarRef) {
      this.order = null;
      return;
    }

    this.order = await order.getOrder(
      this.selectedLocationRef,
      this.selectedCarRef,
      this.startRentalDate,
      this.endRentalDate,
      this.startRentalTime,
      this.endRentalTime
    );
  };
}

import { observable, action, computed } from 'mobx';
import moment from 'moment-timezone';
import _ from 'lodash';
import i18n from 'i18next';

import locations from './Locations';
import cars from './Cars';
import order from './Order';
import {
  getPreselectedDatesForRollPicker,
  getTimeItemsForRollPicker,
  getCurrencyChar
} from './helpers';
import rentalStatuses from './../DriveStore/rentalStatuses';
import { values } from './../../utils/theme';

// period in months
const MAX_RENTAL_PERIOD = 36;
const TODAY = moment().startOf('day');
const TOMORROW = moment()
  .add(1, 'day')
  .startOf('day');
const MAX_RENTAL_DATE = moment()
  .add(MAX_RENTAL_PERIOD, 'month')
  .startOf('day');

export default class BookingStore {
  @observable isLoading = this._defaultStore.isLoading;

  /* step book */
  @observable order = this._defaultStore.order;
  @observable locations = this._defaultStore.locations;
  @observable cars = this._defaultStore.cars;
  @observable selectedLocationRef = this._defaultStore.selectedLocationRef;
  @observable selectedCarRef = this._defaultStore.selectedCarRef;
  @observable carCalendar = this._defaultStore.carCalendar;

  @observable startRentalDate = this._defaultStore.startRentalDate;
  @observable endRentalDate = this._defaultStore.endRentalDate;
  @observable startRentalTime = this._defaultStore.startRentalTime;
  @observable endRentalTime = this._defaultStore.endRentalTime;

  @observable locationInfoRef = this._defaultStore.locationInfoRef;
  @observable carInfoRef = this._defaultStore.carInfoRef;
  @observable priceInfoRef = this._defaultStore.priceInfoRef;
  @observable locationInfoDescription = this._defaultStore.locationInfoDescription;
  @observable carInfoDescription = this._defaultStore.carInfoDescription;
  @observable priceInfoDescription = this._defaultStore.priceInfoDescription;

  /* step pay & confirm */
  @observable stripeApiKey = this._defaultStore.stripeApiKey;
  @observable userCreditCards = this._defaultStore.userCreditCards;
  @observable currentCreditCardRef = this._defaultStore.currentCreditCardRef;

  @observable voucherCode = this._defaultStore.voucherCode;
  @observable loyaltyProgramInfo = this._defaultStore.loyaltyProgramInfo;
  @observable useRefferalAmount = this._defaultStore.useRefferalAmount;
  @observable allowReferralAmountUse = this._defaultStore.allowReferralAmountUse;

  @observable bookingConfirmation = this._defaultStore.bookingConfirmation;

  /* modify existing booking */
  @observable editableOrderRef = this._defaultStore.editableOrderRef;
  @observable isOngoing = this._defaultStore.isOngoing;
  @observable isCancellation = this._defaultStore.isCancellation;
  @observable cancellationOrder = this._defaultStore.cancellationOrder;

  /**
   * @description Default data for store
   */
  get _defaultStore() {
    return {
      isLoading: false,
      order: null,
      locations: [],
      cars: [],
      selectedLocationRef: null,
      selectedCarRef: null,
      carCalendar: null,
      startRentalDate: TOMORROW,
      endRentalDate: TOMORROW,
      startRentalTime: moment(TOMORROW)
        .add(8, 'h')
        .format(values.TIME_STRING_FORMAT),
      endRentalTime: moment(TOMORROW)
        .add(20, 'h')
        .format(values.TIME_STRING_FORMAT),
      locationInfoRef: null,
      carInfoRef: null,
      priceInfoRef: null,
      locationInfoDescription: {},
      carInfoDescription: {},
      priceInfoDescription: {},
      stripeApiKey: null,
      userCreditCards: [],
      currentCreditCardRef: null,
      voucherCode: '',
      loyaltyProgramInfo: '',
      allowReferralAmountUse: false,
      useRefferalAmount: false,
      bookingConfirmation: null,
      editableOrderRef: null,
      isOngoing: false,
      cancellationOrder: null,
      isCancellation: false
    };
  }

  /*
   * @description Reset store to default values
   */
  @action
  resetStore = () => {
    for (const key in this._defaultStore) {
      this[key] = this._defaultStore[key];
    }
  };

  /**
   * @description Get lists of all locations and cars (new booking)
   */
  @action
  getInitialData = async () => {
    if (this.editableOrderRef) {
      /* in case of editing booking use this.startEditing */
      return;
    }

    this.resetStore();
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
   * @param {Object} rental
   * @param {Function} navAction
   * @description Start editing, force selection for booking, nav to screen and fetch data
   */
  @action
  startEditing = async (rental, navAction) => {
    const locationRef = _.get(rental, 'location.reference');
    const carRef = _.get(rental, 'car.car_model.reference');
    const isOngoing = rental.status === rentalStatuses.ONGOING;

    const startDate = moment.utc(rental.start_at).tz(rental.location.timezone);
    const endDate = moment.utc(rental.end_at).tz(rental.location.timezone);

    this.resetStore();
    this.editableOrderRef = rental.reference;
    this.isOngoing = isOngoing;

    if (typeof navAction === 'function') {
      navAction();
    }

    await Promise.all([
      this.selectLocation(locationRef),
      this.selectCar(carRef)
    ]);
    await this.setEditingPeriod(startDate, endDate, isOngoing);
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
      this.correctStartTime();
    } else {
      this.selectedLocationRef = null;
      this.cars = await cars.getCars();
    }

    await this.getOrderSimulation();
    this.isLoading = false;
    // fetch calendar in shadow mode
    this.getCarCalendar();
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

    await this.getOrderSimulation();
    this.isLoading = false;
    // fetch calendar in shadow mode
    this.getCarCalendar();
  };

  /**
   * @param {Object} dateMoment
   * @description Set start rental date as 'moment' object
   */
  @action
  selectStartDate = async dateMoment => {
    if (this.startRentalDate.diff(dateMoment, 'days') === 0) {
      return;
    }

    if (dateMoment.isBefore(TODAY)) {
      this.startRentalDate = TODAY;
    } else {
      this.startRentalDate = dateMoment;
    }

    if (this.endRentalDate.isBefore(this.startRentalDate)) {
      this.endRentalDate = this.startRentalDate;
    }

    this.correctSelectedTime();
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
    if (this.endRentalDate.diff(dateMoment, 'days') === 0) {
      return;
    }

    if (dateMoment.isBefore(TODAY)) {
      this.endRentalDate = TODAY;
    } else {
      this.endRentalDate = dateMoment;
    }

    if (this.startRentalDate.isAfter(this.endRentalDate)) {
      this.startRentalDate = this.endRentalDate;
    }

    this.correctSelectedTime();
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
   * @description Correct chosen time if was selected starting today or the same dates
   */
  @action
  correctSelectedTime = () => {
    /* handle case for ongoign rental */
    if (
      this.isOngoing &&
      TODAY.diff(this.endRentalDate, 'days') === 0 &&
      moment(this.endRentalTime, values.TIME_STRING_FORMAT).isBefore(Date.now())
    ) {
      this.endRentalTime = moment()
        .startOf('hour')
        .add(60, 'minutes')
        .format(values.TIME_STRING_FORMAT);
      return;
    }

    /* handle case for starting today rentals */
    if (this.startRentalDate.isSame(TODAY, 'days')) {
      this.correctStartTime(true);
      return;
    }

    /* handle cases for other rentals */
    const startIndex = this.rollPickerStartSelectedTimeItem;
    const endIndex = this.rollPickerEndSelectedTimeItem;

    if (this.startRentalDate.diff(this.endRentalDate, 'days') !== 0 || startIndex < endIndex) {
      return;
    }

    if (startIndex + 1 < this.rollPickersTimeItems.length) {
      this.endRentalTime = this.rollPickersTimeItems[startIndex + 1].label;
    } else if (endIndex > 0) {
      this.startRentalTime = this.rollPickersTimeItems[endIndex - 1].label;
    } else {
      this.startRentalTime = this._defaultStore.startRentalTime;
      this.endRentalTime = this._defaultStore.endRentalTime;
    }
  };

  /*
   * @description Correct start time for location (use only for today start date)
   */
  @action
  correctStartTime = isToday => {
    /* if isToday wasn't check outside, do it here */
    if (!isToday && !this.startRentalDate.isSame(TODAY, 'days')) {
      return;
    }

    const location = _.find(this.locations, {
      reference: this.selectedLocationRef
    });

    if (location) {
      const currentLocationTime = moment
        .tz(location.timezone)
        .startOf('hour')
        .format(values.TIME_STRING_FORMAT);

      const currentLocationTimeIndex = _.findIndex(
        this.rollPickersTimeItems,
        item => item.label === currentLocationTime
      );

      if (currentLocationTimeIndex < this.rollPickerStartSelectedTimeItem || currentLocationTimeIndex === -1) {
        return;
      }

      const isEndDateToday = this.endRentalDate.isSame(TODAY, 'days');
      /* if time more or equal 22:00 */
      if (currentLocationTimeIndex >= this.rollPickersTimeItems.length - 2) {
        const lastItem = this.rollPickersTimeItems.length - 1;
        this.startRentalTime = this.rollPickersTimeItems[lastItem - 1].label;

        if (isEndDateToday) {
          this.endRentalTime = this.rollPickersTimeItems[lastItem].label;
        }
      } else {
        this.startRentalTime = currentLocationTime;

        if (isEndDateToday && this.rollPickerEndSelectedTimeItem <= currentLocationTimeIndex) {
          this.endRentalTime = this.rollPickersTimeItems[currentLocationTimeIndex + 1].label;
        }
      }
    }
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
    this.correctSelectedTime();
    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
   * @param {string} timeStr
   * @param {number} itemIndex
   * @description Set start rental time
   */
  @action
  selectStartTime = async (timeStr, itemIndex) => {
    if (this.startRentalTime === timeStr) {
      return;
    }

    const isOneDayRental = this.startRentalDate.diff(this.endRentalDate, 'days') === 0;

    if (isOneDayRental && itemIndex + 1 >= this.rollPickersTimeItems.length) {
      // forbid to choose last time-item of day as start
      this.startRentalTime = this.rollPickersTimeItems[itemIndex - 1].label;
    } else {
      this.startRentalTime = timeStr;
    }

    if (isOneDayRental && this.rollPickerEndSelectedTimeItem <= itemIndex) {
      const nextIndex = this.rollPickersTimeItems.length > itemIndex + 1 ? itemIndex + 1 : itemIndex;
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
    if (this.endRentalTime === timeStr) {
      return;
    }

    const isOneDayRental = this.startRentalDate.diff(this.endRentalDate, 'days') === 0;

    if (isOneDayRental && itemIndex === 0) {
      // forbid to choose first time-item of day as end
      this.endRentalTime = this.rollPickersTimeItems[itemIndex + 1].label;
    } else {
      this.endRentalTime = timeStr;
    }

    if (!this.isOngoing && isOneDayRental && this.rollPickerStartSelectedTimeItem >= itemIndex) {
      const prevIndex = itemIndex - 1 >= 0 ? itemIndex - 1 : itemIndex;
      this.startRentalTime = this.rollPickersTimeItems[prevIndex].label;
    }

    if (this.isOngoing) {
      this.correctSelectedTime();
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /*
   * @param {Object} momentStartBooking
   * @param {Object} momentEndBooking
   * @param {boolean} isOngoing
   * @description Set origin start/end dates and time for editing booking
   */
  @action
  setEditingPeriod = async (momentStartBooking, momentEndBooking, isOngoing) => {
    const startDate = moment(momentStartBooking).startOf('day');
    const endDate = moment(momentEndBooking).startOf('day');
    this.startRentalTime = momentStartBooking.format(values.TIME_STRING_FORMAT);
    this.endRentalTime = momentEndBooking.format(values.TIME_STRING_FORMAT);

    if (!isOngoing) {
      /* if rental didn't start, check and set chosen dates to min allowed values */
      this.startRentalDate = startDate.isBefore(TODAY) ? TODAY : startDate;
      this.endRentalDate = endDate.isBefore(this.startRentalDate) ? TOMORROW : endDate;
      this.correctSelectedTime();
    } else {
      /* if rental is ongoing, set start as constant value and end date as min allowed value */
      this.startRentalDate = startDate;

      if (momentEndBooking.isBefore(Date.now())) {
        this.endRentalDate = TODAY;
        this.endRentalTime = moment()
          .startOf('hour')
          .add(60, 'minutes')
          .format(values.TIME_STRING_FORMAT);
      } else {
        this.endRentalDate = endDate;
      }
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

    if (this.priceInfoRef && this.priceInfoRef !== this.priceInfoDescription.reference) {
      this.priceInfoDescription = await order.getPriceDescription(this.priceInfoRef);
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
    } else if (this.stripeApiKey) {
      // data was already fetched
      return !!this.userCreditCards.length;
    }

    this.isLoading = true;

    const data = await order.getPaymentOptions(this.selectedLocationRef);
    this.stripeApiKey = data.paymentPublicApi;
    this.loyaltyProgramInfo = data.loyaltyProgram.message;
    this.allowReferralAmountUse = data.loyaltyProgram.isBalanceAvailable;

    this.userCreditCards = data.userCreditCards;
    const defaultCard = _.find(this.userCreditCards, ['default', true]);
    this.currentCreditCardRef = defaultCard ? defaultCard.reference : null;

    this.isLoading = false;

    return !!this.userCreditCards.length;
  };

  /**
   * @param {Object} cardIoObj
   * @description Add new scanned credit card to list
   */
  @action
  addCreditCardToList = cardStripeObj => {
    const cardData = cardStripeObj.card;

    if (!cardData) {
      return;
    }

    const card = {
      reference: cardData.cardId,
      brand: cardData.brand,
      country: cardData.country,
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      last4: cardData.last4,
      default: !this.currentCreditCardRef,
      token: cardStripeObj.tokenId,
      imageUrl: cardStripeObj.imageUrl
    };

    this.currentCreditCardRef = card.reference;
    this.userCreditCards.push(card);
  };

  /**
   * @param {string} cardIoObj
   * @param {boolean} removeOnlyIfNew
   * @description Remove credit card from userCreditCards list
   */
  @action
  removeCreditCardFromList = (cardRef, removeOnlyIfNew) => {
    const isNew = _.has(_.find(this.userCreditCards, ['reference', cardRef]), 'token');

    if (removeOnlyIfNew && !isNew) {
      return;
    }

    this.userCreditCards = this.userCreditCards.filter(card => card.reference !== cardRef);
    this.currentCreditCardRef = this.userCreditCards.length ? this.userCreditCards[0].reference : null;
  };

  /**
   * @param {string} code
   * @description Apply voucher code to exist order
   */
  @action
  appyVoucherCode = async code => {
    this.isLoading = true;
    this.voucherCode = code;
    const newOrder = await this.getOrderSimulation(false);

    if (newOrder) {
      this.order = newOrder;
    } else {
      this.voucherCode = '';
    }

    this.isLoading = false;
  };

  /**
   * @description Remove voucher code from exist order
   */
  @action
  resetVoucherCode = async () => {
    this.isLoading = true;
    this.voucherCode = '';
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /**
   * @param {string} code
   * @returns {boolean}
   * @description Voucher code validation (regexp and server validation)
   */
  @action
  validateVoucher = async code => {
    const isValidFormat = /^[VR][0-9A-Z]{3,11}$/g.test(code);

    if (!isValidFormat) {
      return i18n.t('error:invalidCodeError');
    }

    const response = await order.validateVoucher(
      code,
      this.selectedLocationRef,
      this.selectedCarRef,
      _.get(this.order, 'schedule.startAt')
    );

    if (response.isValid) {
      return '';
    }

    const defaultMessage = i18n.t('error:invalidCodeError', {
      code,
      context: code[0] === 'R' ? 'referal' : 'voucher'
    });

    return response.invalidMessage || defaultMessage;
  };

  /*
   * @description Switch referral program status, refresh order object
   */
  @action
  switchReferralUsing = async () => {
    this.isLoading = true;
    this.useRefferalAmount = !this.useRefferalAmount;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /*
   * @returns {boolean}
   * @description Confirm booking with all chosen data
   */
  @action
  confirmBooking = async () => {
    this.isLoading = true;
    const payment = {};
    const currentCreditCard = _.find(this.userCreditCards, ['reference', this.currentCreditCardRef]);

    if (currentCreditCard.token) {
      payment.token = currentCreditCard.token;
    } else {
      payment.creditCardReference = this.currentCreditCardRef;
    }

    const payload = { ...this.order, payment };
    this.bookingConfirmation = this.editableOrderRef
      ? await order.updateOrder(this.editableOrderRef, payload)
      : await order.confirmOrder(payload);

    this.isLoading = false;
  };

  /*
   * @description Confirm cancellation of current booking
   */
  @action
  confirmCancellation = async () => {
    this.isLoading = true;
    this.bookingConfirmation = await order.confirmCancellation(this.editableOrderRef, this.cancellationOrder);
    this.isLoading = false;
  };

  /*
   * @description Apply dates which proposed as alternative for booking
   */
  @action
  applyAlternativeDates = async () => {
    const startAlt = _.get(this.order, 'carAvailabilities.alternativeStartAt');
    const endAlt = _.get(this.order, 'carAvailabilities.alternativeEndAt');

    if (!startAlt || !endAlt) {
      return;
    }

    const momentStartAlt = moment.utc(startAlt).tz(this.order.schedule.timezone);
    const momentEndAlt = moment.utc(endAlt).tz(this.order.schedule.timezone);

    this.endRentalTime = momentEndAlt.format(values.TIME_STRING_FORMAT);
    this.endRentalDate = momentEndAlt.startOf('day');

    if (!this.isOngoing) {
      this.startRentalTime = momentStartAlt.format(values.TIME_STRING_FORMAT);
      this.startRentalDate = momentStartAlt.startOf('day');
    }

    this.isLoading = true;
    await this.getOrderSimulation();
    this.isLoading = false;
  };

  /*
   * @description Undo booking (for editing existing rentals)
   */
  @action
  undoBooking = async () => {
    this.isLoading = true;
    this.cancellationOrder = await order.undoBooking(this.editableOrderRef);
    this.isLoading = false;

    return !!this.cancellationOrder;
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
   * @description Get locked data for roll picker about start date
   */
  @computed
  get rollPickerOngoingStartDate() {
    const dateString = this.startRentalDate.format(values.DATE_ROLLPICKER_FORMAT);
    return [
      {
        label: dateString,
        id: dateString,
        available: true
      }
    ];
  }

  /**
   * @description Get selected row into picker for start date
   */
  @computed
  get rollPickerStartSelectedIndex() {
    if (this.isOngoing) {
      return 0;
    }

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
   * @description Get info is price refund or zero
   */
  @computed
  get isOrderPriceRefundOrZero() {
    const currentOrder = this.isCancellation ? this.cancellationOrder : this.order;
    const price = _.get(currentOrder, 'price.amount');

    return !_.isNil(price) && price <= 0;
  }

  /**
   * @description Get formated price string to render in footer
   */
  @computed
  get orderPrice() {
    const unknownPrice = '-';
    const currentOrder = this.isCancellation ? this.cancellationOrder : this.order;
    const price = _.get(currentOrder, 'price.amount', unknownPrice);
    const currencyChar = getCurrencyChar(_.get(currentOrder, 'price.currency'));

    if (price === unknownPrice) {
      return price;
    }

    return `${price}${currencyChar}`;
  }

  /**
   * @description Get formated price string to render in footer
   */
  @computed
  get orderOriginPrice() {
    const currentOrder = this.isCancellation ? this.cancellationOrder : this.order;
    const amount = _.get(currentOrder, 'price.amountOrigin', '');
    const currencyChar = getCurrencyChar(_.get(currentOrder, 'price.currency'));

    return amount || _.isNumber(amount) ? `${amount}${currencyChar}` : null;
  }

  /**
   * @description Get marketing label for price
   */
  @computed
  get priceMarketingLabel() {
    if (!_.has(this.order, 'price.marketingLabel')) {
      return null;
    }

    return this.order.price.marketingLabel;
  }

  /**
   * @description Get duration label for the booking
   */
  @computed
  get bookingDurationLabel() {
    const duration = _.get(this.order, 'schedule.duration');
    return duration ? `${duration} ${i18n.t('common:days')} ` : '';
  }

  /**
   * @description Get label about fees
   */
  @computed
  get feesPriceLabel() {
    const currentOrder = this.isCancellation ? this.cancellationOrder : this.order;
    const amount = _.get(currentOrder, 'feePrice.amount', '');
    const description = _.get(currentOrder, 'feePrice.description', '');
    const currencyChar = getCurrencyChar(_.get(currentOrder, 'feePrice.currency'));

    return amount || _.isNumber(amount) ? `${description}${currencyChar}${amount}` : null;
  }

  /**
   * @description Get label about new price
   */
  @computed
  get newPriceLabel() {
    const amount = _.get(this.order, 'newPrice.amount', '');
    const description = _.get(this.order, 'newPrice.description', '');
    const currencyChar = getCurrencyChar(_.get(this.order, 'newPrice.currency'));

    return amount || _.isNumber(amount) ? `${description}${currencyChar}${amount}` : null;
  }

  /**
   * @description Get label about current price
   */
  @computed
  get currentPriceLabel() {
    const currentOrder = this.isCancellation ? this.cancellationOrder : this.order;
    const amount = _.get(currentOrder, 'currentPrice.amount', '');
    const description = _.get(currentOrder, 'currentPrice.description', '');
    const currencyChar = getCurrencyChar(_.get(currentOrder, 'currentPrice.currency'));

    return amount || _.isNumber(amount) ? `${description}${currencyChar}${amount}` : null;
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
    if (this.isOngoing) {
      return 0;
    }

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
   * @description Get locked time for roll picker about start time
   */
  @computed
  get rollPickerOngoingStartTime() {
    return [
      {
        label: this.startRentalTime,
        id: this.startRentalTime
      }
    ];
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
   * @description Show is current car and location have alternative dates for booking
   */
  @computed
  get isOrderCarHasAlt() {
    if (!_.has(this, 'order.carAvailabilities.status')) {
      return false;
    }

    return this.order.carAvailabilities.status === 'alternative';
  }

  /**
   * @description Message about alternative dates for booking
   */
  @computed
  get orderCarUnavailableMessage() {
    if (!_.has(this, 'order.carAvailabilities.message')) {
      return null;
    }

    const { alternativeStartAt: startAlt, alternativeEndAt: endAlt } = this.order.carAvailabilities;

    if (!this.isOrderCarHasAlt || !startAlt || !endAlt) {
      return this.order.carAvailabilities.message;
    }

    const startAltFormatted =
      i18n.t('booking:pickUpAlt') +
      moment
        .utc(startAlt)
        .tz(this.order.schedule.timezone)
        .format(' ddd DD MMM YYYY HH:mm');

    const endAltFormatted =
      i18n.t('booking:returnAlt') +
      moment
        .utc(endAlt)
        .tz(this.order.schedule.timezone)
        .format(' ddd DD MMM YYYY HH:mm');

    return `${this.order.carAvailabilities.message}\n-${startAltFormatted}\n-${endAltFormatted}`;
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

    if (this.priceInfoRef && this.priceInfoRef === this.priceInfoDescription.reference) {
      return { isPrice: true, ...this.priceInfoDescription };
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

    return `${dateStr} ${timeStr}`;
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

    return `${dateStr} ${timeStr}`;
  }

  /**
   * @description Get max date from carCalendar list
   */
  @computed
  get maxCarCalendarDate() {
    if (!this.carCalendar || !this.carCalendar.length) {
      return MAX_RENTAL_DATE.format(values.DATE_STRING_FORMAT);
    }

    return this.carCalendar[this.carCalendar.length - 1].calendarDay;
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
    const maxDate = MAX_RENTAL_DATE.format(values.DATE_STRING_FORMAT);

    this.carCalendar = await cars.getCarsCalendar(this.selectedLocationRef, this.selectedCarRef, minDate, maxDate);
  };

  /**
   * @param {string} requestHandling
   * @returns {Object | null}
   * @description Get description how will looking the order
   */
  getOrderSimulation = async (requestHandling = true) => {
    const location = _.find(this.locations, {
      reference: this.selectedLocationRef
    });

    if (!this.selectedLocationRef || !this.selectedCarRef || !location) {
      if (requestHandling) {
        this.order = null;
      }

      return null;
    }

    /* prepare order times to utc format */
    const momentFormat = `${values.DATE_STRING_FORMAT}T${values.TIME_STRING_FORMAT}`;
    const startRentalStr = `${this.startRentalDate.format(values.DATE_STRING_FORMAT)}T${this.startRentalTime}`;
    const endRentalStr = `${this.endRentalDate.format(values.DATE_STRING_FORMAT)}T${this.endRentalTime}`;

    const startRental = moment.tz(startRentalStr, momentFormat, location.timezone);
    const endRental = moment.tz(endRentalStr, momentFormat, location.timezone);

    /* get order object */
    const orderSimulation = await order.getOrder(
      this.selectedLocationRef,
      this.selectedCarRef,
      startRental.utc().format(values.DATE_STRING_FORMAT),
      endRental.utc().format(values.DATE_STRING_FORMAT),
      startRental.utc().format(values.TIME_STRING_FORMAT),
      endRental.utc().format(values.TIME_STRING_FORMAT),
      {
        voucherCode: this.voucherCode,
        useRefferal: this.useRefferalAmount,
        editableOrder: this.editableOrderRef
      }
    );

    if (requestHandling) {
      this.order = orderSimulation;
    }

    return orderSimulation;
  };
}

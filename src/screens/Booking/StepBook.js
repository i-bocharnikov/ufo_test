import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, BackHandler } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';

import { bookingStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOIcon, UFOLoader } from './../../components/common';
import UFOTooltip from './../../components/UFOTooltip';
import UFORollPicker from './../../components/UFORollPicker';
import UFODatePickerModal from './../../components/UFODatePickerModal';
import BookingNavWrapper from './components/BookingNavWrapper';
import LocationSlide from './components/LocationSlide';
import CarSlide from './components/CarSlide';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';
import { values } from './../../utils/theme';

@observer
class StepBookScreen extends Component {
  constructor() {
    super();
    this.minPickedDate = moment().format(values.DATE_STRING_FORMAT);
    this.isFetched = false;
    this.state = {
      showDateTooltip: false,
      showModalCalendar: false
    };
    this.onSelectEndRollDateDebounce = _.debounce(this.onSelectEndRollDate, 100);
    this.onSelectStartRollDateDebounce = _.debounce(this.onSelectStartRollDate, 100);
    this.screenFocusListener = null;
    this.backHandler = null;
  }

  async componentDidMount() {
    await this.fetchInitialData();
    this.screenFocusListener = this.props.navigation.addListener('didFocus', this.fetchInitialData);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.navBack);
  }

  componentWillUnmount() {
    this.backHandler.remove()
    this.screenFocusListener.remove();
  }

  render() {
    return (
      <BookingNavWrapper
        navBack={this.navBack}
        navToFaq={this.navToFaq}
        currentStep={1}
        isEditing={!!bookingStore.editableOrderRef}
        BottomActionPanel={this.renderBottomPanel()}
        ref={ref => (this.screenWrapper = ref)}
      >
        <UFOContainer style={styles.screenContainer}>
          {this.renderCarsOptionsBlock()}
          {this.renderDatesOptionsBlock()}
          {this.renderTimeOptionsBlock()}
          {!!bookingStore.editableOrderRef && !bookingStore.isOngoing && (
            <TouchableOpacity
              onPress={this.undoEditingBooking}
              activeOpacity={values.BTN_OPACITY_DEFAULT}
              style={[ styles.actionBtnDark, styles.undoBookingBtn ]}
            >
              <Text
                style={styles.actionBtnDarkLabel}
                numberOfLines={1}
              >
                {this.props.t('booking:undoBooking')}
              </Text>
            </TouchableOpacity>
          )}
          <UFODatePickerModal
            isVisible={this.state.showModalCalendar}
            onClose={() => this.setState({ showModalCalendar: false })}
            onSubmit={this.onSelectCalendarDates}
            calendarData={bookingStore.carCalendar}
            minPickedDate={this.minPickedDate}
            maxPickedDate={bookingStore.maxCarCalendarDate}
            startRental={bookingStore.startRentalDate.format(values.DATE_STRING_FORMAT)}
            endRental={bookingStore.endRentalDate.format(values.DATE_STRING_FORMAT)}
            onlyEndDate={bookingStore.isOngoing}
          />
          <UFOTooltip
            isVisible={this.state.showDateTooltip}
            onClose={() => this.setState({ showDateTooltip: false })}
            originBtn={this.dateTooltipRef}
          >
            {this.props.t('booking:datesTooltip')}
            <Text
              style={styles.tooltipLink}
              onPress={this.onDateTooltipLink}
            >
              {this.props.t('booking:tooltipLink')}
            </Text>
          </UFOTooltip>
          <UFOLoader isVisible={bookingStore.isLoading && !this.isFetched} />
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  renderBottomPanel = () => (
    <BottomActionPanel
      action={this.handleToNextStep}
      actionTitle={this.props.t('booking:stepBookNextTitle')}
      actionSubTitle={this.props.t('booking:stepBookNextSubTitle')}
      isAvailable={bookingStore.isOrderCarAvailable}
      isWaiting={bookingStore.isLoading && this.isFetched}
      openPriceInfo={this.openPriceInfo}
    />
  );

  renderCarsOptionsBlock = () => (
    <Fragment>
      <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
        {this.props.t('booking:locSectionTitle')}
      </Text>
      <FlatList
        data={bookingStore.locations}
        renderItem={this.renderLocationSlide}
        keyExtractor={this.getKeyItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={this.renderEmptyList}
        contentContainerStyle={styles.locSlider}
        extraData={bookingStore.selectedLocationRef}
        pagingEnabled={true}
      />
      <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
        {this.props.t('booking:carsSectionTitle')}
      </Text>
      <FlatList
        data={bookingStore.cars}
        renderItem={this.renderCarSlide}
        keyExtractor={this.getKeyItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={this.renderEmptyList}
        contentContainerStyle={styles.carSlider}
        extraData={bookingStore.selectedCarRef}
      />
    </Fragment>
  );

  getKeyItem = (item, i) => `${i}-${item.reference}`;

  renderLocationSlide = ({ item, index }) => {
    if (bookingStore.editableOrderRef && bookingStore.selectedLocationRef !== item.reference) {
      return null;
    }

    return (
      <LocationSlide
        t={this.props.t}
        location={item}
        onSelect={this.onSelectLocation}
        isSelected={bookingStore.selectedLocationRef === item.reference}
        openInfo={this.openLocationInfo}
        isFirstItem={index === 0 || !!bookingStore.editableOrderRef}
      />
    );
  };

  renderCarSlide = ({ item, index }) => {
    if (bookingStore.isOngoing && bookingStore.selectedCarRef !== item.reference) {
      return null;
    }

    return (
      <CarSlide
        t={this.props.t}
        car={item}
        onSelectCar={this.onSelectCar}
        isSelected={bookingStore.selectedCarRef === item.reference}
        openCarInfo={this.openCarInfo}
        isFirstItem={index === 0 || bookingStore.isOngoing}
      />
    );
  };

  renderEmptyList = () => (
    <Text style={styles.emptyList}>
      {this.props.t('error:connectionIsRequired')}
    </Text>
  );

  renderDatesOptionsBlock = () => (
    <Fragment>
      <View style={[ styles.row, styles.sectionTitleIndents ]}>
        <Text style={[ styles.sectionTitle, styles.datePickTitle ]}>
          {this.props.t('booking:dareSectionTitle')}
        </Text>
        <TouchableOpacity
          onPress={() => this.setState({ showDateTooltip: true })}
          ref={ref => (this.dateTooltipRef = ref)}
        >
          <UFOIcon
            name="ios-information-circle-outline"
            style={styles.dateTolltipicon}
          />
        </TouchableOpacity>
      </View>
      <View style={[ styles.rollPickerSection, styles.blockShadow ]}>
        <UFORollPicker
          data={bookingStore.isOngoing
            ? bookingStore.rollPickerOngoingStartDate
            : bookingStore.rollPickersData
          }
          onRowChange={this.onSelectStartRollDateDebounce}
          selectTo={bookingStore.rollPickerStartSelectedIndex}
          wrapperStyles={styles.rollPicker}
        />
        <View style={styles.rollPickerSeparatorWrapper}>
          <View style={styles.rollPickerSeparator} />
          <TouchableOpacity
            onPress={() => this.setState({ showModalCalendar: true })}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.rollPickerSeparatorBtn}
            hitSlop={{
              top: 36,
              left: 36,
              bottom: 36,
              right: 36
            }}
          >
            <UFOIcon
              name="ios-calendar"
              style={styles.rollPickerSeparatorIcon}
            />
          </TouchableOpacity>
        </View>
        <UFORollPicker
          data={bookingStore.rollPickersData}
          onRowChange={this.onSelectEndRollDateDebounce}
          selectTo={bookingStore.rollPickerEndSelectedIndex}
          wrapperStyles={styles.rollPicker}
        />
      </View>
      <TouchableOpacity
        onPress={() => this.setState({ showModalCalendar: true })}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
        style={styles.calendarViewBtn}
      >
        <Text style={styles.calendarViewBtnLabel}>
          {this.props.t('booking:calendarViewBtn')}
        </Text>
      </TouchableOpacity>
    </Fragment>
  );

  renderTimeOptionsBlock = () => (
    <Fragment>
      <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
        {this.props.t('booking:timeSectionTitle')}
      </Text>
      <View style={[ styles.rollPickerSection, styles.blockShadow ]}>
        <UFORollPicker
          data={bookingStore.isOngoing
            ? bookingStore.rollPickerOngoingStartTime
            : bookingStore.rollPickersTimeItems
          }
          onRowChange={this.onSelectStartTime}
          selectTo={bookingStore.rollPickerStartSelectedTimeItem}
          wrapperStyles={styles.rollPicker}
        />
        <View style={styles.rollPickerSeparatorWrapper}>
          <View style={styles.rollPickerSeparator} />
          <UFOIcon
            name="md-time"
            style={[ styles.rollPickerSeparatorBtn, styles.rollPickerSeparatorIcon ]}
          />
        </View>
        <UFORollPicker
          data={bookingStore.rollPickersTimeItems}
          onRowChange={this.onSelectEndTime}
          selectTo={bookingStore.rollPickerEndSelectedTimeItem}
          wrapperStyles={styles.rollPicker}
        />
      </View>
    </Fragment>
  );

  fetchInitialData = async () => {
    if (!bookingStore.locations.length || !bookingStore.cars.length) {
      this.isFetched = false;
      const screenWrapper = this.screenWrapper.getWrappedInstance();
      screenWrapper && screenWrapper.scrollToTop();
      await bookingStore.getInitialData();
      this.isFetched = true;
    }
  };

  onSelectLocation = ref => {
    if (ref && !bookingStore.editableOrderRef) {
      bookingStore.selectLocation(ref);
    }
  };

  onSelectCar = ref => {
    if (ref && !bookingStore.isOngoing) {
      bookingStore.selectCar(ref);
    }
  };

  openCarInfo = ref => {
    bookingStore.carInfoRef = ref;
    this.props.navigation.navigate(screenKeys.BookingDetails);
  };

  openLocationInfo = ref => {
    bookingStore.locationInfoRef = ref;
    this.props.navigation.navigate(screenKeys.BookingDetails);
  };

  openPriceInfo = () => {
    const ref = _.get(
      bookingStore,
      `order.${bookingStore.editableOrderRef ? 'newPrice' : 'price'}.pricingReference`
    );

    if (ref) {
      bookingStore.priceInfoRef = ref;
      this.props.navigation.navigate(screenKeys.BookingDetails);
    }
  };

  navBack = () => {
    const { navigation } = this.props;

    if (navigation.isFocused()) {
      navigation.navigate(screenKeys.Home);
      bookingStore.editableOrderRef && bookingStore.resetStore();

      return true;
    }

    return false;
  };

  navToFaq = () => {
    this.props.navigation.navigate(
      screenKeys.SupportFaqs,
      { PREVIOUS_SCREEN: screenKeys.Booking }
    );
  };

  onDateTooltipLink = () => {
    Linking.openURL('https://www.ufodrive.com/en/contact');
  };

  onSelectStartRollDate = async index => {
    if (!bookingStore.isOngoing && bookingStore.rollPickerStartSelectedIndex != index) {
      const item = bookingStore.rollPickersData[index];
      const selectedDate = moment(item.label, values.DATE_ROLLPICKER_FORMAT).startOf('day');
      await bookingStore.selectStartDate(selectedDate);
    }
  };

  onSelectEndRollDate = async index => {
    if (bookingStore.rollPickerEndSelectedIndex != index) {
      const item = bookingStore.rollPickersData[index];
      const selectedDate = moment(item.label, values.DATE_ROLLPICKER_FORMAT).startOf('day');
      await bookingStore.selectEndDate(selectedDate);
    }
  };

  onSelectCalendarDates = async (dateStart, dateEnd) => {
    if (dateStart) {
      const startDate = moment(dateStart).startOf('day');
      const endDate = moment(dateEnd).startOf('day');
      await bookingStore.selectCalendarDates(startDate, endDate);
    }
  };

  onSelectStartTime = async index => {
    if (!bookingStore.isOngoing) {
      const item = bookingStore.rollPickersTimeItems[index];
      const selectedTime = item.label;
      await bookingStore.selectStartTime(selectedTime, index);
    }
  };

  onSelectEndTime = async index => {
    const item = bookingStore.rollPickersTimeItems[index];
    const selectedTime = item.label;
    await bookingStore.selectEndTime(selectedTime, index);
  };

  handleToNextStep = async () => {
    if (bookingStore.isOrderCarHasAlt) {
      await bookingStore.applyAlternativeDates();
      return;
    }

    this.props.navigation.navigate(screenKeys.BookingStepPay);
  };

  undoEditingBooking = async () => {
    const isSuccess = await bookingStore.undoBooking();

    if (isSuccess) {
      bookingStore.isCancellation = true;
      this.props.navigation.navigate(screenKeys.BookingStepCancellation);
    }
  };
}

export default translate('', { withRef: true })(StepBookScreen);

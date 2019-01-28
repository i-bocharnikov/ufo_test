import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
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
  }

  async componentDidMount() {
    await this.fetchInitialData();
    this.props.navigation.addListener('didFocus', this.fetchInitialData);
  }

  render() {
    const { t } = this.props;

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        navToFaq={this.navToFaq}
        currentStep={1}
        BottomActionPanel={this.renderBottomPanel()}
        ref={ref => (this.screenWrapper = ref)}
      >
        <UFOContainer style={styles.screenContainer}>
          <Text style={[styles.sectionTitle, styles.sectionTitleIndents]}>
            {t('booking:locSectionTitle')}
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
          <Text style={[styles.sectionTitle, styles.sectionTitleIndents]}>
            {t('booking:carsSectionTitle')}
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
          <View style={[styles.row, styles.sectionTitleIndents]}>
            <Text style={[styles.sectionTitle, styles.datePickTitle]}>
              {t('booking:dareSectionTitle')}
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
          <View style={[styles.rollPickerSection, styles.blockShadow]}>
            <UFORollPicker
              data={bookingStore.rollPickersData}
              onRowChange={this.onSelectStartRollDate}
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
                  name="ios-calendar-outline"
                  style={styles.rollPickerSeparatorIcon}
                />
              </TouchableOpacity>
            </View>
            <UFORollPicker
              data={bookingStore.rollPickersData}
              onRowChange={this.onSelectEndRollDate}
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
              {t('booking:calendarViewBtn')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, styles.sectionTitleIndents]}>
            {t('booking:timeSectionTitle')}
          </Text>
          <View style={[styles.rollPickerSection, styles.blockShadow]}>
            <UFORollPicker
              data={bookingStore.rollPickersTimeItems}
              onRowChange={this.onSelectStartTime}
              selectTo={bookingStore.rollPickerStartSelectedTimeItem}
              wrapperStyles={styles.rollPicker}
            />
            <View style={styles.rollPickerSeparatorWrapper}>
              <View style={styles.rollPickerSeparator} />
              <UFOIcon
                name="ios-clock-outline"
                style={[
                  styles.rollPickerSeparatorBtn,
                  styles.rollPickerSeparatorIcon
                ]}
              />
            </View>
            <UFORollPicker
              data={bookingStore.rollPickersTimeItems}
              onRowChange={this.onSelectEndTime}
              selectTo={bookingStore.rollPickerEndSelectedTimeItem}
              wrapperStyles={styles.rollPicker}
            />
          </View>
          <UFODatePickerModal
            isVisible={this.state.showModalCalendar}
            onClose={() => this.setState({ showModalCalendar: false })}
            onSubmit={this.onSelectCalendarDates}
            calendarData={bookingStore.carCalendar}
            minPickedDate={this.minPickedDate}
            maxPickedDate={bookingStore.maxCarCalendarDate}
            startRental={bookingStore.startRentalDate.format(
              values.DATE_STRING_FORMAT
            )}
            endRental={bookingStore.endRentalDate.format(
              values.DATE_STRING_FORMAT
            )}
          />
          <UFOTooltip
            isVisible={this.state.showDateTooltip}
            onClose={() => this.setState({ showDateTooltip: false })}
            originBtn={this.dateTooltipRef}
          >
            {t('booking:datesTooltip')}
            <Text style={styles.tooltipLink} onPress={this.onDateTooltipLink}>
              {t('booking:tooltipLink')}
            </Text>
          </UFOTooltip>
          <UFOLoader isVisible={bookingStore.isLoading && !this.isFetched} />
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  getKeyItem = (item, i) => `${i}-${item.reference}`;

  renderLocationSlide = ({ item, index }) => {
    return (
      <LocationSlide
        t={this.props.t}
        location={item}
        onSelect={this.onSelectLocation}
        isSelected={bookingStore.selectedLocationRef === item.reference}
        openInfo={this.openLocationInfo}
        isFirstItem={index === 0}
      />
    );
  };

  renderCarSlide = ({ item, index }) => {
    return (
      <CarSlide
        t={this.props.t}
        car={item}
        onSelectCar={this.onSelectCar}
        isSelected={bookingStore.selectedCarRef === item.reference}
        openCarInfo={this.openCarInfo}
        isFirstItem={index === 0}
      />
    );
  };

  renderEmptyList = () => {
    return (
      <Text style={styles.emptyList}>
        {this.props.t('error:connectionIsRequired')}
      </Text>
    );
  };

  renderBottomPanel = () => {
    return (
      <BottomActionPanel
        action={this.handleToNextStep}
        actionTitle={this.props.t('booking:stepBookNextTitle')}
        actionSubTitle={this.props.t('booking:stepBookNextSubTitle')}
        isAvailable={bookingStore.isOrderCarAvailable}
        isWaiting={bookingStore.isLoading && this.isFetched}
        openPriceInfo={this.openPriceInfo}
      />
    );
  };

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
    if (ref) {
      bookingStore.selectLocation(ref);
    }
  };

  onSelectCar = ref => {
    if (ref) {
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
    const ref = _.get(bookingStore, 'order.price.pricingReference');

    if (!ref) {
      return;
    }

    bookingStore.priceInfoRef = ref;
    this.props.navigation.navigate(screenKeys.BookingDetails);
  };

  navBack = () => {
    this.props.navigation.navigate(screenKeys.Home);
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
    const item = bookingStore.rollPickersData[index];
    const selectedDate = moment(
      item.label,
      values.DATE_ROLLPICKER_FORMAT
    ).startOf('day');
    await bookingStore.selectStartDate(selectedDate);
  };

  onSelectEndRollDate = async index => {
    const item = bookingStore.rollPickersData[index];
    const selectedDate = moment(
      item.label,
      values.DATE_ROLLPICKER_FORMAT
    ).startOf('day');
    await bookingStore.selectEndDate(selectedDate);
  };

  onSelectCalendarDates = async (dateStart, dateEnd) => {
    if (!dateStart) {
      return;
    }

    const startDate = moment(dateStart).startOf('day');
    const endDate = moment(dateEnd).startOf('day');
    await bookingStore.selectCalendarDates(startDate, endDate);
  };

  onSelectStartTime = async index => {
    const item = bookingStore.rollPickersTimeItems[index];
    const selectedTime = item.label;
    await bookingStore.selectStartTime(selectedTime, index);
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
}

export default translate('', { withRef: true })(StepBookScreen);

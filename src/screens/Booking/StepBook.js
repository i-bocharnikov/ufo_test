import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';

import { bookingStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOIcon_next, UFOModalLoader } from './../../components/common';
import UFOTooltip from './../../components/UFOTooltip';
import BookingNavWrapper from './components/BookingNavWrapper';
import LocationSlide from './components/LocationSlide';
import CarSlide from './components/CarSlide';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';

@observer
class StepBookScreen extends Component {
  constructor() {
    super();
    this.state = {
      showDateTooltip: false
    };
  }

  async componentDidMount() {
    await bookingStore.getInitialData();
  }

  render() {
    const { t } = this.props;

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        currentStep={1}
        BottomActionPanel={this.renderBottomPanel()}
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
          <View style={[styles.row, styles.sectionTitleIndents]}>
            <Text style={[styles.sectionTitle, styles.datePickTitle]}>
              {t('booking:dareSectionTitle')}
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({showDateTooltip: true})}
              ref={ref => (this.dateTooltipRef = ref)}
            >
              <UFOIcon_next
                name="ios-information-circle-outline"
                style={styles.dateTolltipicon}
              />
            </TouchableOpacity>
          </View>
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
          <UFOTooltip
            isVisible={this.state.showDateTooltip}
            onClose={() => this.setState({showDateTooltip: false})}
            originBtn={this.dateTooltipRef}
          >
            {t('booking:datesTooltip')}
            <Text
              style={styles.tooltipLink}
              onPress={this.onDateTooltipLink}
            >
              {t('booking:tooltipLink')}
            </Text>
          </UFOTooltip>
          <UFOModalLoader isVisible={bookingStore.isLoading} />
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
        {this.props.t('booking:notFoundData')}
      </Text>
    );
  };

  renderBottomPanel = () => {
    const { t } = this.props;

    return (
      <BottomActionPanel
        t={this.props.t}
        action={() => null}
        actionTitle={t('booking:stepBookNextTitle')}
        actionSubTitle={t('booking:stepBookNextSubTitle')}
        isAvailable={false}
        price={undefined}
      />
    );
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
    console.log('CAR', ref);
  };

  openLocationInfo = ref => {
    console.log('LOCATION', ref);
  };

  navBack = () => {
    this.props.navigation.navigate(screenKeys.Home);
  };

  onDateTooltipLink = () => {
    console.log('PRESS DATE TOOLTIP');
  }
}

export default translate()(StepBookScreen);

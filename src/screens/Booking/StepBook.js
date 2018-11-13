import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import { getFromApi } from './../../utils/api';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOImage } from './../../components/common';
import BookingNavWrapper from './components/BookingNavWrapper';
import LocationSlide from './components/LocationSlide';
import CarSlide from './components/CarSlide';
import styles from './styles';
import { values } from './../../utils/theme';

class StepBookScreen extends Component {
  constructor() {
    super();
    this.state = {
      tempLocData: [],
      tempCarData: [],
      selectedLocation: null,
      selectedCar: null
    };
  }

  async componentDidMount() {
    // temp
    const locRes = await getFromApi('/reserve/locations');
    const carRes = await getFromApi('/reserve/carModels');
    this.setState({
      tempLocData: locRes.data.locations,
      tempCarData: carRes.data.carModels
    })
    // temp
  }

  render() {
    const { t } = this.props;
    // temp
    const { tempLocData, tempCarData } = this.state;
    console.log('STATE', this.state);
    // temp

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        currentStep={1}
      >
        <UFOContainer style={styles.screenContainer}>
          <Text style={styles.sectionTitle}>
            {t('booking:locSectionTitle')}
          </Text>
          <FlatList
            data={tempLocData}
            renderItem={this.renderLocationSlide}
            keyExtractor={this.getKeyItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={this.renderEmptyList}
            contentContainerStyle={styles.locSlider}
            extraData={this.state.selectedLocation}
            pagingEnabled={true}
          />
          <Text style={styles.sectionTitle}>
            {t('booking:carsSectionTitle')}
          </Text>
          <FlatList
            data={tempCarData}
            renderItem={this.renderCarSlide}
            keyExtractor={this.getKeyItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={this.renderEmptyList}
            contentContainerStyle={styles.carSlider}
            extraData={this.state.selectedCar}
          />
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
        isSelected={this.state.selectedLocation === item.reference}
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
        isSelected={this.state.selectedCar === item.reference}
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

  onSelectLocation = ref => {
    if (!ref) {
      return;
    }

    if (ref === this.state.selectedLocation) {
      this.setState({selectedLocation: null});
      return;
    }

    this.setState({selectedLocation: ref});
  };

  onSelectCar = ref => {
    if (!ref) {
      return;
    }

    if (ref === this.state.selectedCar) {
      this.setState({selectedCar: null});
      return;
    }

    this.setState({selectedCar: ref});
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
}

export default translate()(StepBookScreen);

import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { UFOImage } from './../../../components/common';
import styles from './../styles';
import { values } from './../../../utils/theme';

export default class CarSlide extends PureComponent {
  render() {
    const {
      t,
      car,
      isSelected,
      isFirstItem
    } = this.props;

    return (
      <View style={!car.available && styles.notAvailableCar}>
        <TouchableOpacity
          onPress={this.handleSelectCar}
          activeOpacity={car.available ? values.BTN_OPACITY_DEFAULT : 1}
          style={[
            styles.carSlide,
            styles.blockShadow,
            !isFirstItem && styles.carSlideLeftSpace,
            isSelected && styles.choosenCar
          ]}
        >
          <UFOImage
            source={{ uri: car.imageUrl }}
            style={styles.carlideImg}
            resizeMode="contain"
          />
          <View style={styles.carSlideLabelWrapper}>
            <View>
              <Text style={styles.carSlideLabel} numberOfLines={1}>
                {`${car.manufacturer} ${car.name}`.toUpperCase()}
              </Text>
              {car.message && (
                <Text style={styles.carSlidePrice} numberOfLines={1}>
                  {car.message}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={this.handleOpenInfo}
              activeOpacity={values.BTN_OPACITY_DEFAULT}
            >
              <Text style={styles.slideInfoLink}>
                {t('booking:infoLink')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  handleSelectCar = () => {
    const { car, onSelectCar } = this.props;

    if (car.available) {
      onSelectCar(car.reference);
    }
  };

  handleOpenInfo = () => {
    this.props.openCarInfo(this.props.car.reference);
  };
}

CarSlide.propTypes = {
  t: PropTypes.func.isRequired,
  onSelectCar: PropTypes.func.isRequired,
  openCarInfo: PropTypes.func.isRequired,
  car: PropTypes.object,
  isSelected: PropTypes.bool,
  isFirstItem: PropTypes.bool
};
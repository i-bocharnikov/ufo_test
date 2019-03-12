import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment-timezone';

import { keys as screenKeys } from './../../navigators/helpers';
import { driveStore, bookingStore, otaKeyStore } from './../../stores';
import rentalStatuses from './../../stores/DriveStore/rentalStatuses';
import {
  UFOText,
  UFOImage,
  UFOIcon,
  UFOLoader
} from './../../components/common';
import { values } from './../../utils/theme';
import styles from './styles';

@observer
class DriveCard extends Component {
  @observable isWaiting = false;

  render() {
    const { t, rental } = this.props;
    const { location, car, status } = _.pick(rental, [
      'location',
      'car',
      'status'
    ]);
    const carModel = _.get(car, 'car_model');

    if (!rental || !carModel || !location) {
      return null;
    }

    return (
      <View style={styles.card}>
        <UFOText h3>{t('rentalReference', { rental })}</UFOText>
        <UFOImage
          source={{ uri: carModel.image_side_url }}
          style={styles.carImg}
          resizeMode="contain"
        />
        <UFOText h3 bold>
          {t('rentalCarModel', { rental })}
        </UFOText>
        <UFOText h3 bold>
          {!driveStore.isOngoing ? '' : t('rentalCar', { rental })}
        </UFOText>
        <UFOText h4>{this.otaKeyStatus}</UFOText>
        <UFOText h4 bold style={styles.startTimeLabel}>
          {t('rentalStartAt', {
            start_at: driveStore.format(
              rental.start_at,
              values.DATE_DRIVE_FORMAT
            )
          })}
        </UFOText>
        <UFOText h4 upper>
          {t('rentalLocation', { rental: rental })}
        </UFOText>
        <UFOText h4 bold>
          {t('rentalEndAt', {
            end_at: driveStore.format(rental.end_at, values.DATE_DRIVE_FORMAT)
          })}
        </UFOText>
        {status !== rentalStatuses.CLOSED && (
          <TouchableOpacity
            style={styles.editRow}
            onPress={this.editBooking}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
          >
            <UFOText bold style={styles.editLabel}>
              {t('editBooking')}
            </UFOText>
            <UFOIcon name="md-calendar" style={styles.editicon} />
          </TouchableOpacity>
        )}
        {this.isWaiting && <UFOLoader isVisible={true} />}
      </View>
    );
  }

  get otaKeyStatus() {
    const t = this.props.t;

    if (!driveStore.inUse) {
      return '';
    }

    if (
      (driveStore.rental && !driveStore.rental.key_id) ||
      !(otaKeyStore.key && otaKeyStore.key.isEnabled)
    ) {
      return t('noKey');
    }

    if (otaKeyStore.isConnecting) {
      return t('connecting');
    }

    if (!otaKeyStore.isConnected) {
      return t('notConnected');
    }

    return otaKeyStore.doorsLocked ? t('locked') : t('unlocked');
  }

  editBooking = () => {
    bookingStore.startEditing(
      { ...this.props.rental },
      () => this.props.navigation.navigate(screenKeys.Booking)
    );
  };
}

DriveCard.propTypes = {
  rental: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

export default translate('drive')(DriveCard);

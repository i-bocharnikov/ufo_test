import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { View, Dimensions } from 'react-native';
import { observer } from 'mobx-react';

import { UFOText, UFOImage } from '../../components/common';
import { dateFormats, colors } from '../../utils/global';
import { driveStore } from '../../stores';
import otaKeyStore from '../../stores/otaKeyStore';
import UFOCard from '../../components/UFOCard';
import { Left, Body } from 'native-base';

const DRIVE_CARD_WIDTH = Dimensions.get('window').width / 1.5;
const DRIVE_CARD_HEIGHT = DRIVE_CARD_WIDTH / 2;

@observer
class DriveCard extends Component {
  render() {
    const { t, rental } = this.props;

    const location = rental ? rental.location : null;
    const car = rental ? rental.car : null;
    const carModel = car ? car.car_model : null;

    if (!rental || !carModel || !location) {
      return null;
    }

    return (
      <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: colors.CARD_BACKGROUND.string(),
          borderRadius: 8
        }}
      >
        <UFOText h3>{t('drive:rentalReference', { rental })}</UFOText>
        <UFOImage
          source={{ uri: carModel.image_side_url }}
          style={{ width: DRIVE_CARD_WIDTH, height: DRIVE_CARD_HEIGHT }}
          resizeMode={'contain'}
        />
        <UFOText
          h3
          bold
        >
          {t('drive:rentalCarModel', { rental })}
        </UFOText>
        <UFOText
          h3
          bold
        >
          {t('drive:rentalCar', { rental })}
        </UFOText>
        <UFOText h4>
          {!driveStore.inUse
            ? ''
            : (driveStore.rental && !driveStore.rental.key_id) ||
              !(otaKeyStore.key && otaKeyStore.key.isEnabled)
            ? t('drive:noKey')
            : otaKeyStore.isConnecting
            ? t('drive:connecting')
            : !otaKeyStore.isConnected
            ? t('drive:notConnected')
            : otaKeyStore.doorsLocked
            ? t('drive:locked')
            : t('drive:unlocked')}
        </UFOText>
        <UFOText
          h4
          bold
          style={{ marginTop: 10 }}
        >
          {t('drive:rentalStartAt', { start_at: driveStore.format(rental.start_at, dateFormats.DRIVE) })}
        </UFOText>
        <UFOText
          h4
          upper
        >
          {t('drive:rentalLocation', { rental: rental })}
        </UFOText>
        <UFOText
          h4
          bold
        >
          {t('drive:rentalEndAt', { end_at: driveStore.format(rental.end_at, dateFormats.DRIVE) })}
        </UFOText>
      </View>
    );
  }
}

export default translate()(DriveCard);

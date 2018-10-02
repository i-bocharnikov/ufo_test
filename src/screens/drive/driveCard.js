import React, { Component } from "react";
import { translate } from "react-i18next";
import { View } from 'react-native'
import { observer } from "mobx-react";

import { UFOText, UFOIcon, UFOImage } from '../../components/common'
import { icons, colors, dateFormats, sizes } from '../../utils/global'
import { driveStore } from '../../stores'
import otaKeyStore from '../../stores/otaKeyStore'
import UFOCard from "../../components/UFOCard";
import { Left, Body } from "native-base";


@observer
class DriveCard extends Component {

  componentDidMount() {
  }

  render() {
    const { t, rental } = this.props;

    let location = rental ? rental.location : null
    let car = rental ? rental.car : null
    let carModel = car ? car.car_model : null


    if (!rental || !carModel || !location) {
      return (null)
    }

    return (
      <UFOCard
        title={t("drive:rentalReference", { rental: rental })}
        texts={[
          t("drive:rentalStartAt", { start_at: driveStore.format(rental.start_at, dateFormats.FULL) }),
          t("drive:rentalEndAt", { end_at: driveStore.format(rental.end_at, dateFormats.FULL) }),
          t("drive:rentalLocation", { rental: rental })]}
        imageSource={{ uri: location.image_url }}
        message={driveStore.rental.message_for_driver}
      >
        <Left>
          <UFOImage source={{ uri: carModel.image_front_url }} style={{ width: 100, height: 50 }} resizeMode={'contain'} />
        </Left>
        <Body>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <UFOText style={{ flex: 0.3 }}>{t("drive:rentalCarModel", { rental: rental })}</UFOText>
            <UFOText h4 style={{ flex: 0.3 }}>{t("drive:rentalCar", { rental: rental })}</UFOText>
            {driveStore.rental && driveStore.rental.contract_signed && !driveStore.rental.contract_ended && (
              <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
                <UFOText h4>{(driveStore.rental && !driveStore.rental.key_id) || !otaKeyStore.key.isEnabled ? t("drive:noKey") : otaKeyStore.isConnecting ? t("drive:connecting") : !otaKeyStore.isConnected ? t("drive:notConnected") : otaKeyStore.vehicleData ? otaKeyStore.vehicleData.doorsLocked ? t("drive:locked") : t("drive:unlocked") : t("drive:noData")}</UFOText>
                {driveStore.rental.key_id && (
                  <UFOIcon icon={icons.KEY} color={otaKeyStore.key ? otaKeyStore.key.isEnabled ? colors.SUCCESS : colors.ACTIVE : colors.ERROR} size={sizes.SMALL} />
                )}
                {driveStore.rental.key_id && (
                  <UFOIcon icon={icons.BLUETOOTH} color={otaKeyStore.isConnected ? colors.SUCCESS : otaKeyStore.isConnecting ? colors.ACTIVE : colors.ERROR} size={sizes.SMALL} />
                )}
                {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                  <UFOIcon icon={otaKeyStore.vehicleData.doorsLocked ? icons.LOCK : icons.UNLOCK} color={otaKeyStore.vehicleData.doorsLocked ? colors.ACTIVE : colors.SUCCESS} size={sizes.SMALL} />
                )}
                {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                  <UFOIcon icon={otaKeyStore.vehicleData.engineRunning ? icons.START : icons.STOP} color={otaKeyStore.vehicleData.engineRunning ? colors.SUCCESS : colors.ACTIVE} size={sizes.SMALL} />
                )}
              </View>
            )}
          </View>
        </Body>
      </UFOCard>
    );
  }
}

export default translate("translations")(DriveCard);


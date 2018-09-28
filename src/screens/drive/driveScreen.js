import React, { Component } from "react";
import { translate, I18n } from "react-i18next";
import { Dimensions, View, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { observer } from "mobx-react";
import { observable } from "mobx";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors, dateFormats, sizes } from '../../utils/global'
import { driveStore } from '../../stores'
import otaKeyStore from '../../stores/otaKeyStore'
import UFOCard from "../../components/UFOCard";
import UFOSlider from "../../components/UFOSlider";
import { Left, Body } from "native-base";
import { confirm } from "../../utils/interaction";

const DRIVE_DEVICE_WIDTH = Dimensions.get('window').width
const DRIVE_WIDTH = DRIVE_DEVICE_WIDTH * 90 / 100
const DRIVE_PADDING_HORIZONTAL = (DRIVE_DEVICE_WIDTH - DRIVE_WIDTH) / 2


@observer
class DriveScreen extends Component {

  componentDidMount() {
  }

  @observable refreshing = false

  renderRental({ item, index }) {


    let rental = item

    let location = rental ? rental.location : null
    let car = rental ? rental.car : null
    let carModel = car ? car.car_model : null


    if (!rental || !carModel || !location) {
      return (null)
    }

    return (
      <I18n>
        {
          (t, { }) => (

            <UFOCard
              title={t("drive:rentalReference", { rental: rental })}
              texts={[
                t("drive:rentalStartAt", { start_at: driveStore.format(rental.start_at, dateFormats.FULL) }),
                t("drive:rentalEndAt", { end_at: driveStore.format(rental.end_at, dateFormats.FULL) }),
                t("drive:rentalLocation", { rental: rental })]}
              imageSource={{ uri: location.image_url }}
            >
              <Left>
                <UFOImage source={{ uri: carModel.image_front_url }} style={{ width: 150, height: 75 }} resizeMode={'contain'} />
              </Left>
              <Body>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <UFOText style={{ flex: 0.3 }}>{t("drive:rentalCarModel", { rental: rental })}</UFOText>
                  <UFOText h4 style={{ flex: 0.3 }}>{t("drive:rentalCar", { rental: rental })}</UFOText>
                  <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                    {driveStore.rental.key_id && (
                      <UFOIcon icon={icons.KEY} color={otaKeyStore.key ? otaKeyStore.key.isEnabled ? colors.DONE : colors.ACTIVE : colors.ERROR} size={sizes.SMALL} />
                    )}
                    {driveStore.rental.key_id && (
                      <UFOIcon icon={icons.BLUETOOTH} color={otaKeyStore.isConnected ? colors.DONE : otaKeyStore.isConnecting ? colors.ACTIVE : colors.ERROR} size={sizes.SMALL} />
                    )}
                    {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                      <UFOIcon icon={otaKeyStore.vehicleData.doorsLocked ? icons.LOCK : icons.UNLOCK} color={otaKeyStore.vehicleData.doorsLocked ? colors.ACTIVE : colors.DONE} size={sizes.SMALL} />
                    )}
                    {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                      <UFOIcon icon={otaKeyStore.vehicleData.engineRunning ? icons.START : icons.STOP} color={otaKeyStore.vehicleData.engineRunning ? colors.DONE : colors.ACTIVE} size={sizes.SMALL} />
                    )}
                  </View>
                </View>
              </Body>
            </UFOCard>
          )
        }
      </I18n>
    )
  }


  selectRental = async (index) => {
    driveStore.selectRental(index)
  }

  refreshRental = async () => {
    driveStore.refreshRental()
  }

  doCloseRental = async () => {
    driveStore.closeRental()
  }

  confirmCloseRental = async (t) => {
    let keyMessage = driveStore.rental && driveStore.rental.car && driveStore.rental.car.has_key === true ? t('drive:confirmCloseRentalKeyMessageConfirmationMessage') : ""
    await confirm(t('global:confirmationTitle'), t('drive:confirmCloseRentalConfirmationMessage', { keyMessage: keyMessage }), async () => {
      this.doCloseRental()
    })
  }


  render() {
    const { t, navigation } = this.props;


    let actionKeys = []


    let actions = []
    if (!driveStore.hasRentalOngoing) {
      actions.push(
        {
          style: actionStyles.ACTIVE,
          icon: icons.HOME,
          onPress: () => this.props.navigation.navigate(screens.HOME.name)
        }
      )
    }
    if (driveStore.rentals.length == 0) {
      actions.push(
        {
          style: actionStyles.DISABLE,
          icon: icons.FIND,
          onPress: () => { }
        }
      )
      actions.push(
        {
          style: actionStyles.DISABLE,
          icon: icons.INSPECT,
          onPress: () => { }
        }
      )
      actions.push(
        {
          style: actionStyles.DISABLE,
          icon: icons.RENTAL_AGREEMENT,
          onPress: () => { }
        }
      )
    }

    driveStore.computeActionFind(actions, () => this.props.navigation.navigate(screens.FIND.name))
    driveStore.computeActionInspect(actions, () => this.props.navigation.navigate(screens.INSPECT.name))
    driveStore.computeActionStartContract(actions, () => this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name))
    driveStore.computeActionReturn(actions, () => this.props.navigation.navigate(screens.RETURN.name))
    driveStore.computeActionCloseRental(actions, () => this.confirmCloseRental(t))

    otaKeyStore.computeActionEnableKey(actions, () => otaKeyStore.enableKey(driveStore.rental.key_id))
    otaKeyStore.computeActionConnect(actions, () => otaKeyStore.connect(true))
    otaKeyStore.computeActionUnlock(actions, () => otaKeyStore.unlockDoors(true))
    otaKeyStore.computeActionLock(actions, () => otaKeyStore.lockDoors(true))
    otaKeyStore.computeActionStart(actions, () => otaKeyStore.enableEngine(true))
    otaKeyStore.computeActionStop(actions, () => otaKeyStore.disableEngine(true))

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refreshRental} />)

    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGDRIVE001.png')}>
        <UFOHeader transparent logo t={t} navigation={navigation} currentScreen={screens.DRIVE} />
        <KeyboardAwareScrollView refreshControl={_RefreshControl}>
          {driveStore.rental && (
            <View style={{ paddingTop: "10%" }}>
              <UFOSlider data={driveStore.rentals} renderItem={this.renderRental} onSnapToItem={this.selectRental} firstItem={driveStore.index} />
            </View>
          )}
          {!driveStore.rental && (
            <View style={{ paddingHorizontal: DRIVE_PADDING_HORIZONTAL, flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
              <UFOCard title={t('drive:noRentalsTitle')} text={t('drive:noRentalsDescription')} />
            </View>
          )}
          {driveStore.rental && (
            <View style={{ paddingHorizontal: 30 }}>
              <UFOCard text={driveStore.rental.message_for_driver} />
            </View>
          )}
        </KeyboardAwareScrollView >
        <UFOActionBar actions={actionKeys} up={100} />
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}

export default translate("translations")(DriveScreen);


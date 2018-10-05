import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import DeviceInfo from 'react-native-device-info';


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, } from '../../components/common'
import { screens, actionStyles, icons, colors, } from '../../utils/global'
import { driveStore } from '../../stores'
import otaKeyStore from '../../stores/otaKeyStore'
import registerStore from "../../stores/registerStore"
import UFOCard from "../../components/UFOCard";
import UFOSlider from "../../components/UFOSlider";
import DriveCard from "./driveCard";
import appStore from "../../stores/appStore";
import { confirm } from "../../utils/interaction";

const DRIVE_DEVICE_WIDTH = Dimensions.get('window').width
const DRIVE_DEVICE_HEIGHT = Dimensions.get('window').height
const DRIVE_WIDTH = DRIVE_DEVICE_WIDTH * 90 / 100
const DRIVE_PADDING_HORIZONTAL = (DRIVE_DEVICE_WIDTH - DRIVE_WIDTH) / 2
const DRIVE_PADDING_TOP = DRIVE_DEVICE_HEIGHT / 15



@observer
class DriveScreen extends Component {

  async componentDidMount() {
    if (driveStore.hasRentalOngoing) {
      otaKeyStore.register()
    }
    if (driveStore.hasRentalOngoing && registerStore.isUserRegistered) {
      this.driveSelected = true
    }
    this.loadKeyForSelectedRental()
  }

  @observable driveSelected = false
  @observable returnSelected = false
  @observable refreshing = false
  @observable activityPending = false

  renderRental({ item, index }) {

    let rental = item

    if (rental) {
      return <DriveCard rental={rental} />
    } else {
      return (null)
    }
  }

  selectRental = async (index) => {
    driveStore.selectRental(index)
    this.loadKeyForSelectedRental()
  }

  loadKeyForSelectedRental = async () => {
    if (driveStore.inUse) {
      await otaKeyStore.getKey(driveStore.rental.key_id)
      if (!otaKeyStore.isKeyEnabled) {
        await otaKeyStore.enableKey(driveStore.rental.key_id)
      }
      await otaKeyStore.getUsedKey()
      if (otaKeyStore.key.keyId !== driveStore.rental.key_id) {
        await otaKeyStore.switchToKey()
      }
      await otaKeyStore.syncVehicleData()
      await otaKeyStore.isConnectedToVehicle()
      if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
        await otaKeyStore.connect()
        await otaKeyStore.getVehicleData()
      }
    }
  }

  refreshRental = async () => {
    await appStore.initialise()
    await driveStore.reset()
  }

  @action
  doCloseRental = async () => {
    this.activityPending = true
    await otaKeyStore.lockDoors(false)
    await otaKeyStore.endKey()
    await driveStore.closeRental()
    this.activityPending = false
  }

  @action
  doUnlockCar = async () => {
    this.activityPending = true
    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
      await otaKeyStore.connect()
    }
    await otaKeyStore.unlockDoors(false)
    await otaKeyStore.getVehicleData()
    this.activityPending = false
  }

  @action
  doLockCar = async () => {
    this.activityPending = true
    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
      await otaKeyStore.connect()
    }
    await otaKeyStore.lockDoors(false)
    await otaKeyStore.getVehicleData()
    this.activityPending = false
  }

  @action
  doConnectCar = async () => {
    this.activityPending = true
    await otaKeyStore.connect()
    await otaKeyStore.getVehicleData()
    this.activityPending = false
  }


  confirmCloseRental = async (t) => {
    let keyMessage = driveStore.rental && driveStore.rental.car && driveStore.rental.car.has_key === true ? t('drive:confirmCloseRentalKeyMessageConfirmationMessage') : ""
    await confirm(t('global:confirmationTitle'), t('drive:confirmCloseRentalConfirmationMessage', { keyMessage: keyMessage }), async () => {
      this.doCloseRental()
    })
  }

  render() {
    const { t, navigation } = this.props;
    let actions = []

    if (!this.driveSelected) {
      actions.push({ style: driveStore.hasRentalConfirmedOrOngoing ? actionStyles.DONE : actionStyles.TODO, icon: icons.RESERVE, onPress: () => navigation.navigate(screens.RESERVE.name) })
      actions.push({ style: registerStore.isUserRegistered ? actionStyles.DONE : actionStyles.TODO, icon: registerStore.isUserRegistered ? icons.MY_DETAILS : icons.REGISTER, onPress: () => navigation.navigate(screens.REGISTER.name) })
      actions.push({ style: driveStore.hasRentalOngoing ? actionStyles.TODO : actionStyles.ACTIVE, icon: icons.DRIVE, onPress: () => this.driveSelected = true })
    } else if (this.driveSelected && !this.returnSelected) {
      actions.push({ style: actionStyles.ACTIVE, icon: icons.BACK, onPress: () => this.driveSelected = false })
      if (!driveStore.hasRentals) {
        actions.push({ style: actionStyles.DISABLE, icon: icons.FIND, onPress: () => { } })
        actions.push({ style: actionStyles.DISABLE, icon: icons.INSPECT, onPress: () => { } })
        actions.push({ style: actionStyles.DISABLE, icon: icons.RENTAL_AGREEMENT, onPress: () => { } })
      } else {
        driveStore.computeActionFind(actions, () => this.props.navigation.navigate(screens.FIND.name))
        driveStore.computeActionInitialInspect(actions, () => this.props.navigation.navigate(screens.INSPECT.name))
        driveStore.computeActionStartContract(actions, () => this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name))

        otaKeyStore.computeActionEnableKey(actions, () => otaKeyStore.enableKey(driveStore.rental.key_id))
        //otaKeyStore.computeActionConnect(actions, this.doConnectCar)
        otaKeyStore.computeActionUnlock(actions, this.doUnlockCar)
        otaKeyStore.computeActionLock(actions, this.doLockCar)
        if (driveStore.rental && driveStore.rental.contract_signed && !driveStore.rental.contract_ended) {
          actions.push({ style: actionStyles.ACTIVE, icon: icons.RETURN, onPress: () => this.returnSelected = true })
        }
      }
    } else {
      actions.push({ style: actionStyles.ACTIVE, icon: icons.BACK, onPress: () => this.returnSelected = false })
      driveStore.computeActionReturn(actions, () => this.props.navigation.navigate(screens.RETURN.name))
      driveStore.computeActionFinalInspect(actions, () => this.props.navigation.navigate(screens.INSPECT.name))
      driveStore.computeActionCloseRental(actions, () => this.confirmCloseRental(t))
    }
    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refreshRental} />)

    return (
      <UFOContainer image={screens.DRIVE.backgroundImage}>
        <UFOHeader transparent logo t={t} navigation={navigation} currentScreen={screens.DRIVE} />
        <KeyboardAwareScrollView refreshControl={_RefreshControl}>
          {!this.driveSelected && !driveStore.hasRentals && (
            <View style={{ paddingTop: 150, paddingLeft: 20, paddingRight: 20 }} >
              <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center', backgroundColor: colors.CARD_BACKGROUND.string(), borderRadius: 8, padding: 20 }}>
                <UFOText h1 bold center style={{ paddingTop: 10 }}>{t('home:reserve', { user: registerStore.user })}</UFOText>
                <UFOText h1 bold center style={{ paddingTop: 5 }}>{t('home:register', { user: registerStore.user })}</UFOText>
                <UFOText h1 bold center style={{ paddingTop: 5 }}>{t('home:drive', { user: registerStore.user })}</UFOText>
              </View>
            </View>
          )}

          {driveStore.hasRentals && driveStore.rental && (
            <View style={{ paddingTop: DRIVE_PADDING_TOP }}>
              <UFOSlider data={driveStore.rentals} renderItem={this.renderRental} onSnapToItem={this.selectRental} firstItem={driveStore.index} />
            </View>
          )}
          {this.driveSelected && !driveStore.rental && (
            <View style={{ paddingTop: 100, paddingHorizontal: DRIVE_PADDING_HORIZONTAL, flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
              <UFOCard title={t('drive:noRentalsTitle')} text={t('drive:noRentalsDescription')} />
            </View>
          )}

        </KeyboardAwareScrollView >
        <UFOActionBar actions={actions} activityPending={this.activityPending} />
      </UFOContainer >
    );
  }
}

export default translate("translations")(DriveScreen);


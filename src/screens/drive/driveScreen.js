import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, RefreshControl } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { observer } from "mobx-react";
import { observable } from "mobx";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, } from '../../components/common'
import { screens, actionStyles, icons, } from '../../utils/global'
import { driveStore } from '../../stores'
import otaKeyStore from '../../stores/otaKeyStore'
import registerStore from "../../stores/registerStore"
import UFOCard from "../../components/UFOCard";
import UFOSlider from "../../components/UFOSlider";
import DriveCard from "./driveCard";
import appStore from "../../stores/appStore";
import { confirm } from "../../utils/interaction";

const DRIVE_DEVICE_WIDTH = Dimensions.get('window').width
const DRIVE_WIDTH = DRIVE_DEVICE_WIDTH * 90 / 100
const DRIVE_PADDING_HORIZONTAL = (DRIVE_DEVICE_WIDTH - DRIVE_WIDTH) / 2


@observer
class DriveScreen extends Component {

  componentDidMount() {
  }

  @observable driveSelected = false
  @observable returnSelected = false
  @observable refreshing = false

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
  }

  refreshRental = async () => {
    appStore.initialise()
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
    let actions = []

    if (!this.driveSelected) {
      actions.push({ style: driveStore.hasRentalConfirmedOrOngoing ? actionStyles.DONE : actionStyles.TODO, icon: icons.RESERVE, onPress: () => navigation.navigate(screens.RESERVE.name) })
      actions.push({ style: registerStore.isUserRegistered ? actionStyles.DONE : actionStyles.TODO, icon: icons.REGISTER, onPress: () => navigation.navigate(screens.REGISTER.name) })
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
        //        otaKeyStore.computeActionEnableKey(actions, () => otaKeyStore.enableKey(driveStore.rental.key_id))
        otaKeyStore.computeActionConnect(actions, () => otaKeyStore.connectCar(true))
        otaKeyStore.computeActionUnlock(actions, () => otaKeyStore.unlockDoors(true))
        otaKeyStore.computeActionLock(actions, () => otaKeyStore.lockDoors(true))
        if (this.rental && this.rental.status === RENTAL_STATUS.ONGOING && this.rental.contract_signed) {
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
      <UFOContainer image={driveStore.hasRentals ? require('../../assets/images/background/UFOBGDRIVE001.png') : require("../../assets/images/background/UFOBGHOME002.png")}>
        <UFOHeader transparent logo t={t} navigation={navigation} currentScreen={screens.DRIVE} />
        <KeyboardAwareScrollView refreshControl={_RefreshControl}>
          {!this.driveSelected && !driveStore.hasRentals && (
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
              <View style={{ paddingTop: '10%', paddingLeft: '10%', paddingRight: '10%' }} >
                <UFOText h2 inverted center style={{ paddingTop: 10 }}>{t('home:reserve', { user: registerStore.user })}</UFOText>
                <UFOText h2 inverted center style={{ paddingTop: 5 }}>{t('home:register', { user: registerStore.user })}</UFOText>
                <UFOText h2 inverted center style={{ paddingTop: 5 }}>{t('home:drive', { user: registerStore.user })}</UFOText>
                <View style={{ height: 100 }}></View>
              </View>
            </View>
          )}

          {driveStore.hasRentals && driveStore.rental && (
            <View style={{ paddingTop: "10%" }}>
              <UFOSlider data={driveStore.rentals} renderItem={this.renderRental} onSnapToItem={this.selectRental} firstItem={driveStore.index} />
            </View>
          )}
          {this.driveSelected && !driveStore.rental && (
            <View style={{ paddingHorizontal: DRIVE_PADDING_HORIZONTAL, flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
              <UFOCard title={t('drive:noRentalsTitle')} text={t('drive:noRentalsDescription')} />
            </View>
          )}

        </KeyboardAwareScrollView >
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}

export default translate("translations")(DriveScreen);


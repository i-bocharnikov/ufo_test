import React, { Component } from "react";
import { translate } from "react-i18next";
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
      <UFOCard
        title={rental.reference}
        texts={[driveStore.format(rental.start_at, dateFormats.FULL), driveStore.format(rental.end_at, dateFormats.FULL), location.name]}
        imageSource={{ uri: location.image_url }}
      >
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <UFOImage source={{ uri: carModel.image_front_url }} style={{ height: 50, width: null, flex: 0.4 }} resizeMode={'contain'} />
          <View style={{ flex: 0.6, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            <UFOText style={{ flex: 0.5 }}>{carModel.manufacturer + " " + carModel.name + " - " + car.reference}</UFOText>
            <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <UFOIcon icon={icons.KEY} color={!otaKeyStore.key ? colors.ERROR : otaKeyStore.key.isEnabled ? colors.DONE : colors.ACTIVE} size={sizes.SMALL} />
              <UFOIcon icon={icons.BLUETOOTH} color={otaKeyStore.isConnected ? colors.DONE : otaKeyStore.isConnecting ? colors.ACTIVE : colors.ERROR} size={sizes.SMALL} />
              {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                <UFOIcon icon={otaKeyStore.vehicleData.doorsLocked ? icons.LOCK : icons.UNLOCK} color={otaKeyStore.vehicleData.doorsLocked ? colors.ACTIVE : colors.DONE} size={sizes.SMALL} />
              )}
              {otaKeyStore.isConnected && otaKeyStore.vehicleData && (
                <UFOIcon icon={otaKeyStore.vehicleData.engineRunning ? icons.START : icons.STOP} color={otaKeyStore.vehicleData.engineRunning ? colors.DONE : colors.ACTIVE} size={sizes.SMALL} />
              )}
            </View>
          </View>
        </View>
      </UFOCard>);
  }

  selectRental = async (index) => {
    driveStore.selectRental(index)
  }

  refreshRental = async () => {
    driveStore.refreshRental()
  }

  render() {
    const { t, navigation } = this.props;


    let actionKeys = []


    let actions = []
    if (!driveStore.rental) {
      actions.push(
        {
          style: actionStyles.TODO,
          icon: icons.HOME,
          onPress: () => this.props.navigation.navigate(screens.HOME.name)
        }
      )
    }

    driveStore.computeActionFind(actions, () => this.props.navigation.navigate(screens.FIND.name))
    driveStore.computeActionInspect(actions, () => this.props.navigation.navigate(screens.INSPECT.name))
    driveStore.computeActionStartContract(actions, () => this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name))


    if (driveStore.rental && driveStore.rental.contract_signed) {
      actions.push(
        {
          style: driveStore.rental.ready_for_return ? actionStyles.TODO : actionStyles.DISABLE,
          icon: icons.RETURN,
          onPress: () => this.props.navigation.navigate(screens.RETURN.name)
        }
      )
    }

    if (driveStore.rental && driveStore.rental.contract_signed && !driveStore.rental.final_inspection_done) {
      actionKeys = [
        {
          style: actionStyles.ACTIVE,
          icon: icons.KEY,
          onPress: () => otaKeyStore.enableKey(driveStore.rental.key_id)
        },
        {
          style: actionStyles.ACTIVE,
          icon: icons.CONNECT,
          onPress: () => otaKeyStore.connect(true)
        },
        {
          style: actionStyles.ACTIVE,
          icon: icons.UNLOCK,
          onPress: () => otaKeyStore.unlockDoors(true)
        },
        {
          style: actionStyles.ACTIVE,
          icon: icons.LOCK,
          onPress: () => otaKeyStore.lockDoors(true)
        },
        {
          style: actionStyles.ACTIVE,
          icon: icons.START,
          onPress: () => otaKeyStore.enableEngine(true)
        },
        {
          style: actionStyles.ACTIVE,
          icon: icons.STOP,
          onPress: () => otaKeyStore.disableEngine(true)
        }
      ]
    }
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
        </KeyboardAwareScrollView >
        <UFOActionBar actions={actionKeys} up={100} />
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}

export default translate("translations")(DriveScreen);


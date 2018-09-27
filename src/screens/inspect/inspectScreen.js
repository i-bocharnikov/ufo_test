import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOImage } from '../../components/common'
import { screens, actionStyles, icons } from '../../utils/global'
import { driveStore, inspectStore } from '../../stores'
import UFOSlider from '../../components/UFOSlider'
import { confirm } from "../../utils/interaction";
import UFOCard from "../../components/UFOCard";
const markerImage = require('../../assets/images/marker.png')

const INSPECT_DEVICE_WIDTH = Dimensions.get('window').width
const INSPECT_CAR_WIDTH = INSPECT_DEVICE_WIDTH * 80 / 100
const INSPECT_CAR_HEIGHT = INSPECT_CAR_WIDTH / 2
const INSPECT_CAR_PADDING_HORIZONTAL = (INSPECT_DEVICE_WIDTH - INSPECT_CAR_WIDTH) / 2

@observer
class InspectScreen extends Component {

  @observable damageIndex = 0
  @observable isReady = false
  @observable refreshing = false

  componentDidMount() {
    this.refresh()
  }

  @action
  refresh = async () => {
    this.refreshing = true
    await inspectStore.listCarDamages()
    this.refreshing = false
  }

  renderDamage({ item, index }) {
    let damage = item
    return (
      <UFOCard title={'Damage ' + (index + 1) + '/' + inspectStore.carDamages.length} text={damage.comment} imageSource={{ reference: damage.document.reference }} />
    );
  }

  onSnapToItem = async (index) => {
    this.damageIndex = index
  }

  doConfirmInitialInspection = async (t) => {
    if (await inspectStore.confirmInitialInspection(t)) {
      driveStore.refreshRental()
      this.props.navigation.navigate(screens.DRIVE.name)
    }
  }

  confirmInitialInspection = async (t) => {
    await confirm(t('global:confirmationTitle'), t('inspect:confirmInitialInspectionConfirmationMessage'), async () => {
      this.doConfirmInitialInspection(t)
    })
  }



  renderBody(t) {

    let carModel = driveStore.rental ? driveStore.rental.car ? driveStore.rental.car.car_model : null : null
    let currentDamage = this.damageIndex >= 0 && this.damageIndex < inspectStore.carDamages.length ? inspectStore.carDamages[this.damageIndex] : null

    return (
      <KeyboardAwareScrollView refreshControl={(<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)}>
        <View style={{ paddingTop: 10, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
          <View style={{ paddingHorizontal: INSPECT_CAR_PADDING_HORIZONTAL, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <UFOCard title={t('inspect:inspectGuidance')} text={driveStore.rental ? driveStore.rental.car.damage_state : ""} />
            <UFOImage style={{ width: INSPECT_CAR_WIDTH, height: INSPECT_CAR_HEIGHT }} source={{ uri: carModel ? carModel.image_top_h_url : "" }} >
              {currentDamage && (
                <UFOImage style={{
                  position: 'relative',
                  left: currentDamage.relative_position_x * 100 - 5 + "%",
                  top: currentDamage.relative_position_y * 100 - 5 + "%",
                  width: 15,
                  height: 15
                }} source={markerImage} />
              )}
            </UFOImage>
          </View>
          <UFOSlider data={inspectStore.carDamages} renderItem={this.renderDamage} onSnapToItem={this.onSnapToItem} />
          <View style={{ height: 100 }}></View>
        </View>
      </KeyboardAwareScrollView >
    )
  }


  render() {
    const { t, navigation } = this.props;

    /*if (!this.isReady) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.BACKGROUND.string() }}>
            <ActivityIndicator style={styles.centered} size="large" color={colors.ACTIVE} />
          </View>
          );
        }*/

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.ADD,
        onPress: () => this.props.navigation.navigate(screens.INSPECT_LOCATE.name)
      },
      {
        style: actionStyles.TODO,
        icon: icons.VALIDATE,
        onPress: () => this.confirmInitialInspection(t)
      },
    ]

    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGINSPECT001.png')}>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.INSPECT} title={t('inspect:inspectTitle', { rental: driveStore.rental })} subTitle={driveStore.rental.car.reference} />
        {this.renderBody(t)}
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(InspectScreen);


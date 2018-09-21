import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import driveStore from '../../stores/driveStore'
import UFOCard from '../../components/UFOCard'
import UFOSlider from '../../components/UFOSlider'
import inspectStore from "../../stores/inspectStore";
import { confirm } from "../../utils/interaction";
const markerImage = require('../../assets/images/marker.png')

const window = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = DEVICE_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width - 40
const CAR_HEIGHT = CAR_WIDTH / 2

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
    let slideItem = {
      subtitle: damage.comment,
      source: { reference: damage.document.reference }
    }
    return (
      <UFOCard data={slideItem} />
    );
  }

  onSnapToItem = async (index) => {
    this.damageIndex = index
  }

  doConfirmInitialInspection = async (t) => {
    if (await inspectStore.confirmInitialInspection(t)) {
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
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={(<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)}
      >
        <View style={{
          flex: 1, flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
        }}>
          <UFOText style={{ padding: 20 }}>{t('inspect:inspectGuidance')}</UFOText>
          <UFOText style={{ paddingBottom: 20 }}>{driveStore.rental ? driveStore.rental.car.damage_state : ""}</UFOText>
          <UFOImage style={{ width: CAR_WIDTH, height: CAR_HEIGHT }} source={{ uri: carModel ? carModel.image_top_h_url : "" }} >
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
          <UFOSlider data={inspectStore.carDamages} renderItem={this.renderDamage} onSnapToItem={this.onSnapToItem}>
          </UFOSlider>
        </View>
      </ScrollView >
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
      <UFOContainer>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('inspect:inspectTitle', { rental: driveStore.rental })} />
        {this.renderBody(t)}
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(InspectScreen);


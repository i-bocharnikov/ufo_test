import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOImage, UFOTextInput } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import driveStore from '../../stores/driveStore'
import inspectStore from "../../stores/inspectStore";
const markerImage = require('../../assets/images/marker.png')

const window = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = DEVICE_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width - 40
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class CommentDamageScreen extends Component {

  @observable comment = ""

  componentDidMount() {
    comment = ""
  }

  renderBody(t) {

    let carModel = driveStore.rental ? driveStore.rental.car ? driveStore.rental.car.car_model : null : null
    return (
      <View>
        <UFOText style={{ padding: 20 }}>{t('inspect:commentGuidance')}</UFOText>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }}>
            <UFOImage source={{ reference: inspectStore.documentReference }} style={{
              width: DEVICE_WIDTH / 3, height: DEVICE_HEIGHT / 3
            }} />
            <UFOImage style={{ width: DEVICE_WIDTH / 3, height: DEVICE_HEIGHT / 3 }} source={{ uri: carModel.image_top_h_url }} >
              <UFOImage style={{
                position: 'relative',
                left: inspectStore.relativePositionX * 100 - 3 + "%",
                top: inspectStore.relativePositionY * 100 - 3 + "%",
                width: 10,
                height: 10
              }} source={markerImage} />
            </UFOImage>
          </View>
        </View>
        <View style={{ padding: 20 }} >
          <UFOTextInput value={this.comment} placeholder={t('inspect:commentPlaceholder')} multiline={true} numberOfLines={4} onChangeText={(text) => this.comment = text} />
        </View>
      </View>
    )
  }

  @action
  doSave = async (t) => {
    inspectStore.comment = this.comment
    if (inspectStore.addCarDamage()) {
      this.props.navigation.popToTop()
    }
  }

  render() {
    const { t, navigation } = this.props;

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.popToTop()
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.SAVE,
        onPress: () => this.doSave(t)
      },
    ]

    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGINSPECT001.png')}>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('inspect:commentDamageTitle', { rental: driveStore.rental })} />
        {this.renderBody(t)}
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(CommentDamageScreen);

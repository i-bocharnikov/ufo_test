import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, Image, ImageBackground, TouchableOpacity, PanResponder } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import { driveStore, inspectStore } from '../../stores'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UFOCard from "../../components/UFOCard";
const markerImage = require('../../assets/images/marker.png')

const window = Dimensions.get('window');
const DEVICE_WIDTH = window.width
const DEVICE_HEIGHT = window.height
const BODY_WIDTH = DEVICE_WIDTH - 40
const BODY_HEIGHT = DEVICE_HEIGHT - 200

@observer
class LocateDamageScreen extends Component {

  @observable relativePositionY = 0.5
  @observable relativePositionX = 0.5

  constructor(props) {
    super(props)
    this.relativePositionY = 0.5
    this.relativePositionX = 0.5
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        //console.log("******************onPanResponderGrant", gestureState)
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        //console.log("******************onPanResponderMove", gestureState)
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.relativePositionY = evt.nativeEvent.locationY / BODY_HEIGHT
        this.relativePositionX = evt.nativeEvent.locationX / BODY_WIDTH
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        //console.log("******************onPanResponderTerminate", gestureState)
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  @action
  doNext = async (t) => {
    inspectStore.relativePositionX = (1 - this.relativePositionY)
    inspectStore.relativePositionY = this.relativePositionX
    this.props.navigation.navigate(screens.INSPECT_CAPTURE.name)
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
        icon: icons.NEXT,
        onPress: () => this.doNext(t)
      },
    ]

    let carModel = driveStore.rental ? driveStore.rental.car ? driveStore.rental.car.car_model : null : null

    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGINSPECT001.png')}>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.INSPECT_LOCATE} title={t('inspect:locateDamageTitle', { rental: driveStore.rental })} />
        <KeyboardAwareScrollView>
          <View style={{ padding: 20, flexDirection: 'column', justifyContent: 'flex-start' }}>
            <UFOCard title={t('inspect:locateGuidance')} />
            <View {...this._panResponder.panHandlers} >
              <ImageBackground style={{ width: BODY_WIDTH, height: BODY_HEIGHT }} source={{ uri: carModel.image_top_v_url }} resizeMode='contain' >
                {true && (
                  <UFOImage style={{
                    position: 'relative',
                    top: this.relativePositionY * 100 - 4 + "%",
                    left: this.relativePositionX * 100 - 4 + "%",
                    width: 25,
                    height: 25
                  }}
                    source={markerImage} />
                )}
              </ImageBackground >
            </View >
          </View >
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(LocateDamageScreen);


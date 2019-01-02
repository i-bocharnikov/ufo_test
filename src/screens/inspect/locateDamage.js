import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Dimensions, View, ImageBackground, PanResponder } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import UFOHeader from '../../components/header/UFOHeader';
import UFOActionBar from '../../components/UFOActionBar';
import { UFOContainer, UFOImage } from '../../components/common';
import { screens, actionStyles, icons } from '../../utils/global';
import { driveStore, inspectStore } from '../../stores';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UFOCard from '../../components/UFOCard';
const markerImage = require('../../assets/images/marker.png');

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const BODY_WIDTH = DEVICE_WIDTH - 40;
const BODY_HEIGHT = DEVICE_HEIGHT - 200;

@observer
class LocateDamageScreen extends Component {
  @observable relativePositionY = 0.5;
  @observable relativePositionX = 0.5;

  constructor(props) {
    super(props);
    this.relativePositionY = 0.5;
    this.relativePositionX = 0.5;
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: () => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        //console.log("******************onPanResponderGrant", gestureState)
      },
      onPanResponderMove: () => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        //console.log("******************onPanResponderMove", gestureState)
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.relativePositionY = evt.nativeEvent.locationY / BODY_HEIGHT;
        this.relativePositionX = evt.nativeEvent.locationX / BODY_WIDTH;
      },
      onShouldBlockNativeResponder: () => true
    });
  }

  @action
  doNext = async () => {
    inspectStore.relativePositionX = 1 - this.relativePositionY;
    inspectStore.relativePositionY = this.relativePositionX;
    this.props.navigation.navigate(screens.INSPECT_CAPTURE.name);
  };

  render() {
    const { t, navigation } = this.props;

    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.popToTop()
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.NEXT,
        onPress: () => this.doNext()
      }
    ];

    const carModel = driveStore.rental
      ? driveStore.rental.car
        ? driveStore.rental.car.car_model
        : null
      : null;

    return (
      <UFOContainer image={screens.INSPECT_LOCATE.backgroundImage}>
        <UFOHeader
          transparent
          t={t}
          navigation={navigation}
          currentScreen={screens.INSPECT_LOCATE}
          title={t('inspect:locateDamageTitle', { rental: driveStore.rental })}
        />
        <KeyboardAwareScrollView>
          <View style={{ padding: 20, flexDirection: 'column', justifyContent: 'flex-start' }}>
            <UFOCard title={t('inspect:locateGuidance')} />
            <View {...this._panResponder.panHandlers}>
              <ImageBackground
                style={{ width: BODY_WIDTH, height: BODY_HEIGHT }}
                source={{ uri: carModel.image_top_v_url }}
                resizeMode="contain"
              >
                {true && (
                  <UFOImage
                    style={{
                      position: 'relative',
                      top: this.relativePositionY * 100 - 4 + '%',
                      left: this.relativePositionX * 100 - 4 + '%',
                      width: 25,
                      height: 25
                    }}
                    source={markerImage}
                  />
                )}
              </ImageBackground>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate('translations')(LocateDamageScreen);

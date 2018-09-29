import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Image, StyleSheet, View, Dimensions, ImageEditor, ImageStore } from 'react-native';
import { RNCamera } from 'react-native-camera';
import _ from 'lodash'
import { observable, action } from "mobx";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import registerStore from '../../stores/registerStore';
import { showWarning } from '../../utils/interaction'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UFOCard from "../../components/UFOCard";
import { Body } from "native-base";

const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const CARD_RATIO = 1.586
const CARD_WIDTH = DEVICE_WIDTH - 60
const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO
const PADDING_WIDTH = (DEVICE_WIDTH - CARD_WIDTH) / 2
const PADDING_HEIGHT = (DEVICE_HEIGHT - CARD_HEIGHT) / 2

const captureStates = {
  PREVIEW: 'PREVIEW',
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE',
}

@observer
class DriverLicenceScreen extends Component {

  @observable captureState = null // state 0 = capture front; 1 = capture back; 2 = validate front & back
  @observable frontImageUrl = null
  @observable backImageUrl = null
  @observable activityPending = false

  @action
  doCancel = async (isInWizzard) => {
    isInWizzard ? this.props.navigation.navigate(screens.HOME.name) : this.props.navigation.popToTop()
  }

  @action
  doReset = async (isInWizzard) => {
    this.frontImageUrl = null
    this.backImageUrl = null
    this.captureState = captureStates.CAPTURE_FRONT
  }

  @action
  doCapture = async (t, isInWizzard) => {

    if (!this.camera) {
      showWarning(t("Registration:CameraNotAvailable"))
      return
    }
    this.activityPending = true
    const options = { quality: 1, base64: true };
    //Take photo
    let fullImage = await this.camera.takePictureAsync(options)
    //Crop Image
    const { uri, width, height } = fullImage;
    const ratioX = width / DEVICE_WIDTH
    const ratioy = height / DEVICE_HEIGHT
    const cropData = {
      offset: { x: PADDING_WIDTH * ratioX, y: PADDING_HEIGHT * ratioy },
      size: { width: CARD_WIDTH * ratioX, height: CARD_HEIGHT * ratioy },
    };
    ImageEditor.cropImage(uri, cropData, url => {
      if (this.captureState === captureStates.CAPTURE_FRONT) {
        this.frontImageUrl = url
        this.captureState = captureStates.CAPTURE_BACK
        this.activityPending = false
        return
      }
      if (this.captureState === captureStates.CAPTURE_BACK) {
        this.backImageUrl = url
        this.captureState = captureStates.VALIDATE
        this.activityPending = false
        return
      }
    }, error => {
      this.activityPending = false
      showWarning(t("Registration:CameraProcessingError", { message: error.message }))
    }
    )
  }

  @action
  doskip = async (isInWizzard) => {
    this.backImageUrl = null
    this.captureState = captureStates.VALIDATE
  }

  @action
  doSave = async (t, isInWizzard) => {
    this.activityPending = true
    let type = this.frontImageUrl && this.backImageUrl ? "two_side" : "one_side"
    if (this.frontImageUrl) {
      let document = await registerStore.uploadDocument("driver_licence", type, "driver_licence", "front_side", this.frontImageUrl)
      if (document && document.reference) {
        registerStore.user.driver_licence_front_side_reference = document.reference
      }
    }
    if (this.backImageUrl) {
      let document = await registerStore.uploadDocument("driver_licence", type, "driver_licence", "back_side", this.backImageUrl)
      if (document && document.reference) {
        registerStore.user.driver_licence_back_side_reference = document.reference
      }
    }
    if (await registerStore.save()) {
      this.props.navigation.popToTop()
      this.activityPending = false
      return
    }
    this.activityPending = false

  }

  render() {

    const { t, navigation } = this.props;

    let isInWizzard = this.props.navigation.getParam('isInWizzard', false)

    //Check if we have to retrieve imageUrl from overview screen
    if (this.captureState === null) {
      this.frontImageUrl = navigation.getParam('frontImageUrl');
      this.backImageUrl = navigation.getParam('backImageUrl');
      if (this.frontImageUrl === undefined || this.frontImageUrl === null || this.frontImageUrl === 'loading') {
        this.captureState = captureStates.CAPTURE_FRONT
      } else {
        this.captureState = captureStates.PREVIEW
      }
    }

    let actions = []
    actions.push({
      style: actionStyles.ACTIVE,
      icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
      onPress: async () => await this.doCancel(isInWizzard)
    })

    if (this.captureState === captureStates.VALIDATE || this.captureState === captureStates.PREVIEW) {

      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.NEW_CAPTURE,
        onPress: async () => await this.doReset(isInWizzard)
      })
    }

    if (this.captureState === captureStates.VALIDATE) {

      let isNewCapture = _.isEmpty(registerStore.user.driver_licence_front_side_reference)
      actions.push(
        {
          style: isNewCapture ? actionStyles.TODO : actionStyles.DISABLE,
          icon: icons.SAVE,
          onPress: async () => this.doSave(t, isInWizzard)
        }
      )
    }
    /* 
        if (this.captureState === captureStates.CAPTURE_BACK) {
    
          actions.push({
            style: actionStyles.ACTIVE,
            icon: icons.SKIP,
            onPress: () => this.doskip(isInWizzard)
          })
        } */

    if (this.captureState === captureStates.CAPTURE_FRONT || this.captureState === captureStates.CAPTURE_BACK) {

      actions.push({
        style: actionStyles.TODO,
        icon: icons.CAPTURE,
        onPress: async () => {
          this.doCapture(t, isInWizzard)
        }
      },
      )
    }

    let inputLabel = this.captureState === captureStates.CAPTURE_FRONT ? 'register:driverLicenceFrontInputLabel' : 'register:driverLicenceBackInputLabel'

    let showCamera = this.captureState !== captureStates.VALIDATE && this.captureState !== captureStates.PREVIEW

    return (
      <UFOContainer image={require("../../assets/images/background/UFOBGREGISTER001.png")}>
        {!showCamera && (
          <UFOHeader t={t} navigation={navigation} title={t('register:driverLicenceTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_DRIVER_LICENCE} />
        )}
        {showCamera && (
          <View style={styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={t('register:cameraPermissionTitle')}
              permissionDialogMessage={t('register:cameraPermissionMessage')}
            />
            <UFOHeader t={t} transparent navigation={navigation} logo currentScreen={screens.REGISTER_DRIVER_LICENCE} />
            <View style={{
              position: 'absolute',
              top: PADDING_HEIGHT,
              left: PADDING_WIDTH,
              bottom: PADDING_HEIGHT,
              right: PADDING_WIDTH,
              backgroundColor: colors.BACKGROUND.alpha(0.7).string(),
              justifyContent: 'center',
              alignContent: 'center'
            }}>
              <UFOText upper h3 center>{t(inputLabel)}</UFOText>
            </View>
          </View>
        )}
        {!showCamera && (
          < KeyboardAwareScrollView
            enableOnAndroid={true}
            resetScrollToCoords={{ x: 0, y: 0 }
            }>
            <View style={{ paddingTop: 10, paddingHorizontal: 10, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
              <UFOCard title={t('register:driverLicenceCheckLabel')}>
                <Body>
                  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignContent: 'center' }}>
                    <UFOImage source={{ uri: this.frontImageUrl }} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} />
                    <UFOImage source={{ uri: this.backImageUrl }} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} />
                  </View>
                </Body>
              </UFOCard>
            </View>
            <View style={{ height: 100 }}></View>
          </KeyboardAwareScrollView >
        )}
        <UFOActionBar actions={actions} activityPending={this.activityPending} />
      </UFOContainer >

    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default translate("translations")(DriverLicenceScreen);

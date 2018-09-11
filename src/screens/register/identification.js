import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { NavigationEvents } from 'react-navigation';
import { Image, StyleSheet, View, Dimensions, ImageEditor, ImageStore } from 'react-native';
import { Container, Content, Form, Text, Row, Grid, Card, CardItem, Body, List, ListItem, Thumbnail } from 'native-base';
import { RNCamera } from 'react-native-camera';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import registerStore from '../../stores/registerStore';
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'
import { showWarning } from '../../utils/toast'
import { observable, action } from "mobx";


const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const CARD_RATIO = 1.586
const CARD_WIDTH = DEVICE_WIDTH - 40
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
class IdentificationScreen extends Component {

  @observable captureState = null // state 0 = capture front; 1 = capture back; 2 = validate front & back
  @observable frontImageUrl = null
  @observable backImageUrl = null

  @action
  doCancel = async (isInWizzard) => {
    isInWizzard ? this.props.navigation.navigate(screens.HOME) : this.props.navigation.popToTop()
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
        return
      }
      if (this.captureState === captureStates.CAPTURE_BACK) {
        this.backImageUrl = url
        this.captureState = captureStates.VALIDATE
        return
      }
    }, error =>
        showWarning(t("Registration:CameraProcessingError", { message: error.message }))
    )
  }

  @action
  doskip = async (isInWizzard) => {
    this.backImageUrl = null
    this.captureState = captureStates.VALIDATE
  }

  @action
  doSave = async (t, isInWizzard) => {
    let type = this.frontImageUrl && this.backImageUrl ? "two_side" : "one_side"
    if (this.frontImageUrl) {
      let document = await registerStore.uploadDocument("identification", type, "id", "front_side", this.frontImageUrl)
      if (document && document.reference) {
        registerStore.user.identification_front_side_reference = document.reference
      }
    }
    if (this.backImageUrl) {
      let document = await registerStore.uploadDocument("identification", type, "id", "back_side", this.backImageUrl)
      if (document && document.reference) {
        registerStore.user.identification_back_side_reference = document.reference
      }
    }
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE, { 'isInWizzard': isInWizzard })
        return
      } else {
        this.props.navigation.popToTop()
        return
      }
    }
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
      style: styles.ACTIVE,
      icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
      onPress: async () => await this.doCancel(isInWizzard)
    })

    if (this.captureState === captureStates.VALIDATE || this.captureState === captureStates.PREVIEW) {

      actions.push({
        style: styles.ACTIVE,
        icon: icons.NEW_CAPTURE,
        onPress: async () => await this.doReset(isInWizzard)
      })
    }

    if (this.captureState === captureStates.VALIDATE) {

      let isNewCapture = _.isEmpty(registerStore.user.identification_front_side_reference)
      actions.push(
        {
          style: isNewCapture ? styles.TODO : styles.DISABLE,
          icon: icons.SAVE,
          onPress: async () => this.doSave(t, isInWizzard)
        }
      )
    }

    if (this.captureState === captureStates.CAPTURE_BACK) {

      actions.push({
        style: styles.ACTIVE,
        icon: icons.SKIP,
        onPress: () => this.doskip(isInWizzard)
      })
    }

    if (this.captureState === captureStates.CAPTURE_FRONT || this.captureState === captureStates.CAPTURE_BACK) {

      actions.push({
        style: styles.TODO,
        icon: icons.CAPTURE,
        onPress: async () => {
          this.doCapture(t, isInWizzard)
        }
      },
      )
    }

    let inputLabel = this.captureState === captureStates.CAPTURE_FRONT ? 'register:identificationFrontInputLabel' : 'register:identificationBackInputLabel'

    let showCamera = this.captureState !== captureStates.VALIDATE && this.captureState !== captureStates.PREVIEW

    return (
      <Container>
        {showCamera && (
          <View style={_styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={_styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={t('register:cameraPermissionTitle')}
              permissionDialogMessage={t('register:cameraPermissionMessage')}
            />
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
              <Text style={{ color: colors.TEXT.string(), textAlign: 'center' }}>{t(inputLabel)}</Text>
            </View>
            <HeaderComponent t={t} title={t('register:identificationTitle', { user: registerStore.user })} />
          </View>
        )}
        {!showCamera && (
          <View>
            <HeaderComponent t={t} title={t('register:identificationTitle', { user: registerStore.user })} />
            <View>
              < Text style={{ color: colors.TEXT.string(), padding: 20 }}>{t('register:identificationCheckLabel')}</Text>
              <Image source={{ uri: this.frontImageUrl }} style={{
                width: CARD_WIDTH, height: CARD_HEIGHT, position: 'absolute',
                top: PADDING_HEIGHT - (CARD_HEIGHT / 2) - 5,
                left: PADDING_WIDTH,
              }} />
              <Image source={{ uri: this.backImageUrl }} style={{
                width: CARD_WIDTH, height: CARD_HEIGHT, position: 'absolute',
                top: PADDING_HEIGHT + (CARD_HEIGHT / 2) + 5,
                left: PADDING_WIDTH,
              }} />
            </View>
          </View>
        )
        }
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_IDENTIFICATION })} />
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}

const _styles = StyleSheet.create({
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

export default translate("translations")(IdentificationScreen);

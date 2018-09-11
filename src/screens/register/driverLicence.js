import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { NavigationEvents } from 'react-navigation';
import { Image, StyleSheet, View, Dimensions, ImageEditor, ImageStore } from 'react-native';
import { Container, Content, Form, Text, Row, Grid, Card, CardItem, Body, List, ListItem, Thumbnail } from 'native-base';
import { RNCamera } from 'react-native-camera';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import usersStore from '../../stores/usersStore';
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'
import { showWarning } from '../../utils/toast'
import { observable } from "mobx";


const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const CARD_RATIO = 1.586
const CARD_WIDTH = DEVICE_WIDTH - 40
const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO
const PADDING_WIDTH = (DEVICE_WIDTH - CARD_WIDTH) / 2
const PADDING_HEIGHT = (DEVICE_HEIGHT - CARD_HEIGHT) / 2

const captureStates = {
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE',
}

@observer
class DriverLicenceScreen extends Component {

  @observable captureState = null // state 0 = capture front; 1 = capture back; 2 = validate front & back
  @observable frontImageUrl = null
  @observable backImageUrl = null

  capturePicture = async (t) => {

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

  uploadAndSave = async (t) => {
    let type = this.frontImageUrl && this.backImageUrl ? "two_side" : "one_side"
    if (this.frontImageUrl) {
      let document = await usersStore.uploadDocument("driver_licence", type, "driver_licence", "front_side", this.frontImageUrl)
      if (document && document.reference) {
        usersStore.user.driver_licence_front_side_reference = document.reference
      }
    }
    if (this.backImageUrl) {
      let document = await usersStore.uploadDocument("driver_licence", type, "driver_licence", "back_side", this.backImageUrl)
      if (document && document.reference) {
        usersStore.user.driver_licence_back_side_reference = document.reference
      }
    }
    if (await usersStore.save()) {
      this.props.navigation.popToTop()
      return
    }
  }

  render() {

    const { t, navigation } = this.props;

    if (this.captureState === null) {
      this.frontImageUrl = navigation.getParam('frontImageUrl');
      this.backImageUrl = navigation.getParam('backImageUrl');
      if (this.frontImageUrl === undefined || this.frontImageUrl === null || this.frontImageUrl === 'loading') {
        this.captureState = captureStates.CAPTURE_FRONT
      } else {
        this.captureState = captureStates.VALIDATE
      }
    }
    let actions = []
    if (this.captureState === captureStates.VALIDATE) {
      actions.push({
        style: styles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => { this.props.navigation.pop() }
      })
      actions.push(
        {
          style: styles.ACTIVE,
          icon: icons.REDO,
          onPress: () => {
            this.frontImageUrl = null
            this.backImageUrl = null
            this.captureState = captureStates.CAPTURE_FRONT
          }
        })
      actions.push(
        {
          style: styles.TODO,
          icon: icons.SAVE,
          onPress: async () => this.uploadAndSave()
        }
      )
    } else {
      actions.push({
        style: styles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.pop()
      })

      if (this.captureState === captureStates.CAPTURE_BACK) {
        actions.push({
          style: styles.ACTIVE,
          icon: icons.SKIP,
          onPress: () => this.captureState = captureStates.VALIDATE
        })
      }

      actions.push({
        style: styles.TODO,
        icon: icons.CAPTURE,
        onPress: async () => {
          this.capturePicture(t)
        }
      },
      )
    }

    let inputLabel = this.captureState === captureStates.CAPTURE_FRONT ? 'register:driverLicenceFrontInputLabel' : 'register:driverLicenceBackInputLabel'

    console.log("******* ready to show " + this.captureState)

    return (
      <Container>
        {this.captureState !== captureStates.VALIDATE && (
          <View style={_styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={_styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
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
            <HeaderComponent t={t} title={t('register:driverLicenceTitle', { user: usersStore.user })} />
          </View>
        )}
        {this.captureState === captureStates.VALIDATE && (
          <View>
            <HeaderComponent t={t} title={t('register:driverLicenceTitle', { user: usersStore.user })} />
            <View>
              < Text style={{ color: colors.TEXT.string(), padding: 20 }}>{t('register:driverLicenceCheckLabel')}</Text>
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
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_DRIVER_LICENCE })} />
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

export default translate("translations")(DriverLicenceScreen);

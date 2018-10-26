import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { ImageBackground, View, Dimensions, ImageEditor, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';

import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOImage } from '../../components/common'
import registerStore from '../../stores/registerStore';
import { screens, actionStyles, icons, colors, dims } from '../../utils/global'
import { showWarning } from '../../utils/interaction'
import { observable, action } from "mobx";
import UFOCard from "../../components/UFOCard";
import { Body } from "native-base";
import { checkAndRequestCameraPermission } from "../../utils/permissions";

const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const CARD_RATIO = 1024 / 639
const CARD_WIDTH = DEVICE_WIDTH - 60
const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO
const PADDING_WIDTH = (DEVICE_WIDTH - CARD_WIDTH) / 2
const PADDING_HEIGHT = (DEVICE_HEIGHT - CARD_HEIGHT) / 2

const captureStates = {
  PREVIEW: 'PREVIEW',
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE',
};

@observer
class IdentificationScreen extends Component {
  async componentDidMount() {
    //this.isCameraAllowed = await checkAndRequestCameraPermission()
  }

  @observable captureState = null // state 0 = capture front; 1 = capture back; 2 = validate front & back
  @observable frontImageUrl = null
  @observable backImageUrl = null
  @observable activityPending = false
  @observable isCameraAllowed = false


  @action
  doCancel = async isInWizzard => {
    isInWizzard
      ? this.props.navigation.navigate(screens.HOME.name)
      : this.props.navigation.popToTop();
  }

  @action
  doReset = async isInWizzard => {
    this.frontImageUrl = null;
    this.backImageUrl = null;
    this.captureState = captureStates.CAPTURE_FRONT;
  }

  @action
  doCapture = async (t, isInWizzard) => {
    this.activityPending = true;
    const imageData = await this.cameraRef.takePicture();
    if (!imageData) {
      this.activityPending = false;

      return;
    }
    const { uri, width, height } = imageData;
    // Crop Image
    const ratioX = width / DEVICE_WIDTH;
    const ratioy = height / DEVICE_HEIGHT;
    const cropData = {
      offset: {
        x: PADDING_WIDTH * ratioX,
        y: PADDING_HEIGHT * ratioy,
      },
      size: {
        width: CARD_WIDTH * ratioX,
        height: CARD_HEIGHT * ratioy,
      },
    };
    ImageEditor.cropImage(uri, cropData, url => {
      if (this.captureState === captureStates.CAPTURE_FRONT) {
        this.frontImageUrl = url;
        this.captureState = captureStates.CAPTURE_BACK;
        this.activityPending = false;

        return;
      }
      if (this.captureState === captureStates.CAPTURE_BACK) {
        this.backImageUrl = url;
        this.captureState = captureStates.VALIDATE;
        this.activityPending = false;

        return;
      }
    }, error => {
      this.activityPending = false;
      showWarning(t("Registration:CameraProcessingError", {message: error.message}));
    });
  }

  @action
  doskip = async (isInWizzard) => {
    this.backImageUrl = null;
    this.captureState = captureStates.VALIDATE;
  }

  @action
  doSave = async (t, isInWizzard) => {
    this.activityPending = true

    let type = this.frontImageUrl && this.backImageUrl ? "two_side" : "one_side"
    if (this.frontImageUrl) {
      let document = await registerStore.uploadDocument("identification", type, "id", "front_side", this.frontImageUrl)
      if (document && document.reference) {
        registerStore.user.identification_front_side_reference = document.reference
        registerStore.identificationFrontDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(document.reference));
      }
    }
    if (this.backImageUrl) {
      let document = await registerStore.uploadDocument("identification", type, "id", "back_side", this.backImageUrl)
      if (document && document.reference) {
        registerStore.user.identification_back_side_reference = document.reference
        registerStore.identificationBackDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(document.reference));
      }
    }
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE.name, { 'isInWizzard': isInWizzard })
        this.activityPending = false
        return
      } else {
        this.props.navigation.popToTop()
        this.activityPending = false
        return
      }
    }
  }

  render() {
    const { t, navigation } = this.props;
    let isInWizzard = this.props.navigation.getParam('isInWizzard', false);

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

      let isNewCapture = _.isEmpty(registerStore.user.identification_front_side_reference)
      actions.push(
        {
          style: isNewCapture ? actionStyles.TODO : actionStyles.DISABLE,
          icon: icons.SAVE,
          onPress: async () => this.doSave(t, isInWizzard)
        }
      )
    }

    /*  if (this.captureState === captureStates.CAPTURE_BACK) {
   
       actions.push({
         style: actionStyles.ACTIVE,
         icon: icons.SKIP,
         onPress: () => this.doskip(isInWizzard)
       })
     }
  */
    if (this.captureState === captureStates.CAPTURE_FRONT
      || this.captureState === captureStates.CAPTURE_BACK) {

      actions.push({
        style: this.isCameraAllowed ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.CAPTURE,
        onPress: () => this.doCapture(t, isInWizzard),
      });
    }

    let inputLabel = this.captureState === captureStates.CAPTURE_FRONT ? 'register:identificationFrontInputLabel' : 'register:identificationBackInputLabel'

    let showCamera = this.captureState !== captureStates.VALIDATE && this.captureState !== captureStates.PREVIEW

    let sample = this.captureState === captureStates.CAPTURE_FRONT ? require('../../assets/images/scan/id-front.jpg') : require('../../assets/images/scan/id-back.jpg')

    return (
      <UFOContainer image={screens.REGISTER_IDENTIFICATION.backgroundImage}>
        {!showCamera && (
          <UFOHeader t={t} navigation={navigation} title={t('register:identificationTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_IDENTIFICATION} />
        )}
        {showCamera && (
          <View style={styles.container}>
            <UFOHeader
              t={t}
              transparent
              navigation={navigation}
              logo
              currentScreen={screens.REGISTER_IDENTIFICATION}
            />
            <UFOCamera
              t={t}
              onCameraReady={() => (this.isCameraAllowed = true)}
              flashMode={RNCAMERA_CONSTANTS.FlashMode.on}
              ref={ref => (this.cameraRef = ref)}
            />
            <ImageBackground source={sample} style={{
              position: 'absolute',
              top: PADDING_HEIGHT,
              left: PADDING_WIDTH,
              bottom: PADDING_HEIGHT,
              right: PADDING_WIDTH,
              width: CARD_WIDTH, height: CARD_HEIGHT, justifyContent: 'center',
              alignContent: 'center',
              opacity: 0.4
            }}>
              <UFOText style={{ opacity: 1, zIndex: 20 }} upper h1 bold color={this.activityPending ? colors.DISABLE : colors.INVERTED_TEXT} center>{t(inputLabel)}</UFOText>
            </ImageBackground>
          </View>
        )}
        {!showCamera && (
          < KeyboardAwareScrollView
            enableOnAndroid={true}
            resetScrollToCoords={{ x: 0, y: 0 }
            }>
            <View style={{ paddingTop: 10, paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
              <UFOCard title={t('register:identificationCheckLabel')}>
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

export default translate("translations")(IdentificationScreen);

import React, { Component, Fragment } from 'react';
import {
  ImageBackground,
  View,
  ScrollView,
  Text,
  ImageEditor,
  Dimensions,
  StyleSheet
} from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';

import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import UFOCard from './../../components/UFOCard';
import { UFOImage, UFOContainer } from './../../components/common';
import registerStore from './../../stores/registerStore';
import { screens, actionStyles, icons, images } from './../../utils/global';
import { showWarning } from './../../utils/interaction';
import styles from './styles';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const CARD_RATIO = 1024 / 639;
const CARD_WIDTH = DEVICE_WIDTH - 80;
const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO;
const PADDING_WIDTH = (DEVICE_WIDTH - CARD_WIDTH) / 2;
const PADDING_HEIGHT = (DEVICE_HEIGHT - CARD_HEIGHT) / 2;

const captureStates = {
  PREVIEW: 'PREVIEW',
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE'
};

const bgImageStyles = StyleSheet.create({
  bgArea: {
    position: 'absolute',
    top: PADDING_HEIGHT,
    left: PADDING_WIDTH,
    bottom: PADDING_HEIGHT,
    right: PADDING_WIDTH,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

@observer
class IdentificationScreen extends Component {
  @observable frontImageUrl = registerStore.identificationFrontDocument;
  @observable backImageUrl = registerStore.identificationBackDocument;
  @observable captureState = null;
  @observable activityPending = false;
  @observable isCameraAllowed = false;

  render() {
    const { t, navigation } = this.props;

    if (this.captureState === null) {

      this.captureState =
        !this.frontImageUrl || this.frontImageUrl === 'loading'
          ? captureStates.CAPTURE_FRONT
          : this.captureState = captureStates.PREVIEW;
    }

    const inputLabel =
      this.captureState === captureStates.CAPTURE_FRONT
        ? 'register:identificationFrontInputLabel'
        : 'register:identificationBackInputLabel';

    const showCamera =
      this.captureState !== captureStates.VALIDATE && this.captureState !== captureStates.PREVIEW;

    const sample =
      this.captureState === captureStates.CAPTURE_FRONT
        ? images.captureCardIdFront
        : images.captureCardIdBack;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.REGISTER_IDENTIFICATION}
          title={
            showCamera ? null : t('register:identificationTitle', { user: registerStore.user })
          }
          logo={showCamera}
          transparent={showCamera}
        />
        {!showCamera && (
          <ScrollView>
            <View style={styles.cardsWrapper}>
              <UFOCard title={t('register:identificationCheckLabel')}>
                <View style={styles.cardsContainer}>
                  <UFOImage
                    source={{ uri: this.frontImageUrl }}
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                    fallbackToImage={true}
                  />
                  <UFOImage
                    source={{ uri: this.backImageUrl }}
                    style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                    fallbackToImage={true}
                  />
                </View>
              </UFOCard>
            </View>
          </ScrollView>
        )}
        {showCamera && (
          <Fragment>
            <UFOCamera
              onCameraReady={() => (this.isCameraAllowed = true)}
              ref={ref => (this.cameraRef = ref)}
              forbiddenCallback={navigation.goBack}
            />
            <ImageBackground
              source={sample}
              style={[ bgImageStyles.bgArea, styles.cardCameraBackground ]}
            />
            <View style={bgImageStyles.bgArea}>
              <Text
                style={[
                  styles.cardCameraLabel,
                  this.activityPending && styles.cardCameraBackground
                ]}
              >
                {t(inputLabel).toUpperCase()}
              </Text>
            </View>
          </Fragment>
        )}
        <UFOActionBar
          actions={this.compileActions()}
          activityPending={this.activityPending}
        />
      </UFOContainer>
    );
  }

  @action
  doCancel = async () => {
    this.props.navigation.popToTop();
  };

  @action
  doReset = async () => {
    this.frontImageUrl = null;
    this.backImageUrl = null;
    this.captureState = captureStates.CAPTURE_FRONT;
  };

  @action
  doCapture = async () => {
    const t = this.props.t;
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
        y: PADDING_HEIGHT * ratioy
      },
      size: {
        width: CARD_WIDTH * ratioX,
        height: CARD_HEIGHT * ratioy
      }
    };
    ImageEditor.cropImage(
      uri,
      cropData,
      url => {
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
      },
      error => {
        this.activityPending = false;
        showWarning(t('Registration:CameraProcessingError', { message: error.message }));
      }
    );
  };

  @action
  doskip = async () => {
    this.backImageUrl = null;
    this.captureState = captureStates.VALIDATE;
  };

  @action
  doSave = async () => {
    this.activityPending = true;
    const type = this.frontImageUrl && this.backImageUrl ? 'two_side' : 'one_side';

    if (this.frontImageUrl) {
      const document = await registerStore.uploadDocument(
        'identification',
        type,
        'id',
        'front_side',
        this.frontImageUrl
      );

      if (document && document.reference) {
        registerStore.user.identification_front_side_reference = document.reference;
        const imgData = await registerStore.downloadDocument(document.reference);
        registerStore.identificationFrontDocument = imgData
          ? `data:image/png;base64,${imgData}`
          : null;
      }
    }

    if (this.backImageUrl) {
      const document = await registerStore.uploadDocument(
        'identification',
        type,
        'id',
        'back_side',
        this.backImageUrl
      );

      if (document && document.reference) {
        registerStore.user.identification_back_side_reference = document.reference;
        const imgData = await registerStore.downloadDocument(document.reference);
        registerStore.identificationBackDocument = imgData
          ? `data:image/png;base64,${imgData}`
          : null;
      }
    }

    if (await registerStore.save()) {
      this.props.navigation.popToTop();
      this.activityPending = false;

      return;
    }
  };

  compileActions = () => {
    const actions = [];

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.CANCEL,
      onPress: this.doCancel
    });

    if (
      this.captureState === captureStates.VALIDATE ||
      this.captureState === captureStates.PREVIEW
    ) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.NEW_CAPTURE,
        onPress: this.doReset
      });
    }

    if (this.captureState === captureStates.VALIDATE) {
      const isNewCapture = _.isEmpty(registerStore.user.identification_front_side_reference);
      actions.push({
        style: isNewCapture ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SAVE,
        onPress: this.doSave
      });
    }

    if (
      this.captureState === captureStates.CAPTURE_FRONT ||
      this.captureState === captureStates.CAPTURE_BACK
    ) {
      actions.push({
        style: this.isCameraAllowed ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.CAPTURE,
        onPress: this.doCapture
      });
    }

    return actions;
  };
}

export default translate('translations')(IdentificationScreen);

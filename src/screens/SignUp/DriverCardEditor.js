import React, { Component, Fragment } from 'react';
import { Image, View, ScrollView, Text, ImageEditor } from 'react-native';
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
import cameraMaskStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  CARD_WIDTH,
  CARD_HEIGHT,
  PADDING_WIDTH,
  PADDING_HEIGHT
} from './styles/cameraMaskStyles';

const captureStates = {
  PREVIEW: 'PREVIEW',
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE'
};

@observer
class DriverLicenceScreen extends Component {
  @observable captureState = null;
  @observable frontImageUrl = null;
  @observable backImageUrl = null;
  @observable activityPending = false;
  @observable isCameraAllowed = false;

  render() {
    const { t, navigation } = this.props;

    //Check if we have to retrieve imageUrl from overview screen
    if (this.captureState === null) {
      this.frontImageUrl = navigation.getParam('frontImageUrl');
      this.backImageUrl = navigation.getParam('backImageUrl');

      if (
        this.frontImageUrl === undefined ||
        this.frontImageUrl === null ||
        this.frontImageUrl === 'loading'
      ) {
        this.captureState = captureStates.CAPTURE_FRONT;
      } else {
        this.captureState = captureStates.PREVIEW;
      }
    }

    const showCamera =
      this.captureState !== captureStates.VALIDATE && this.captureState !== captureStates.PREVIEW;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.REGISTER_DRIVER_LICENCE}
          title={
            showCamera ? null : t('register:driverLicenceTitle', { user: registerStore.user })
          }
          logo={showCamera}
          transparent={showCamera}
        />
        {!showCamera && (
          <ScrollView>
            <View style={styles.cardsWrapper}>
              <UFOCard title={t('register:driverLicenceCheckLabel')}>
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
            {this.renderCameraMask()}
          </Fragment>
        )}
        <UFOActionBar
          actions={this.compileActions()}
          activityPending={this.activityPending}
        />
      </UFOContainer>
    );
  }

  renderCameraMask = () => {
    const sample = this.captureState === captureStates.CAPTURE_FRONT
      ? images.driverCardFront
      : images.driverCardBack;

    const captureHint = this.captureState === captureStates.CAPTURE_FRONT
        ? this.props.t('register:driverLicenceFrontInputLabel')
        : this.props.t('register:driverLicenceBackInputLabel');

    return (
      <View style={cameraMaskStyles.wrapper}>
        <View style={[ cameraMaskStyles.verticalOverlap, cameraMaskStyles.blurMask ]} />
        <View style={[ cameraMaskStyles.horizontalOverlap, cameraMaskStyles.blurMask ]} />
        <Image
          source={sample}
          style={cameraMaskStyles.sample}
        />
        <View style={[ cameraMaskStyles.horizontalOverlap, cameraMaskStyles.blurMask ]} />
        <View style={[ cameraMaskStyles.verticalOverlap, cameraMaskStyles.blurMask ]} />
        <View style={cameraMaskStyles.labelArea}>
          <Text style={[
            styles.cardCameraLabel,
            this.activityPending && styles.cardCameraBackground
          ]}>
            {captureHint.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

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
    const ratioX = width / SCREEN_WIDTH;
    const ratioy = height / SCREEN_HEIGHT;
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
        'driver_licence',
        type,
        'driver_licence',
        'front_side',
        this.frontImageUrl
      );

      if (document && document.reference) {
        registerStore.user.driver_licence_front_side_reference = document.reference;
        const imgData = await registerStore.downloadDocument(document.reference);
        registerStore.driverLicenceFrontDocument = imgData
          ? `data:image/png;base64,${imgData}`
          : null;
      }
    }

    if (this.backImageUrl) {
      const document = await registerStore.uploadDocument(
        'driver_licence',
        type,
        'driver_licence',
        'back_side',
        this.backImageUrl
      );

      if (document && document.reference) {
        registerStore.user.driver_licence_back_side_reference = document.reference;
        const imgData = await registerStore.downloadDocument(document.reference);
        registerStore.driverLicenceBackDocument = imgData
          ? `data:image/png;base64,${imgData}`
          : null;
      }
    }

    if (await registerStore.save()) {
      this.props.navigation.popToTop();
      this.activityPending = false;

      return;
    }

    this.activityPending = false;
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
      const isNewCapture = _.isEmpty(registerStore.user.driver_licence_front_side_reference);
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

export default translate('translations')(DriverLicenceScreen);

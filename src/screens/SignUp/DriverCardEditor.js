import React, { Component } from 'react';
import { Image, View, Text, ImageEditor, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';

import UFOCamera from './../../components/UFOCamera';
import { UFOHeader } from './../../components/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOImage, UFOContainer } from './../../components/common';
import { registerStore } from './../../stores';
import { downloadFromApi } from './../../utils/api_deprecated';
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
import { images } from './../../utils/theme';
// deprecated, using in old UFOActionBar
import { actionStyles, icons } from './../../utils/global';

const captureStates = {
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  CAPTURE_BACK: 'CAPTURE_BACK',
  VALIDATE: 'VALIDATE'
};

@observer
class DriverCardEditorScreen extends Component {
  cameraRef = React.createRef();

  @observable activityPending = false;
  @observable isCameraAllowed = false;
  @observable frontImageUrl = null;
  @observable backImageUrl = null;
  @observable captureState = captureStates.CAPTURE_FRONT;

  render() {
    const { t, navigation } = this.props;

    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          title={t('driverLicenceLabel')}
          leftBtnIcon="keyboard-backspace"
          leftBtnAction={this.doCancel}
          rightBtnUseDefault={true}
        />
        {this.captureState === captureStates.VALIDATE ? this.renderNewPreview() : (
          <UFOCamera
            onCameraReady={this.onCameraReady}
            ref={this.cameraRef}
            forbiddenCallback={navigation.goBack}
            cameraMask={this.renderCameraMask()}
          />
        )}
        <UFOActionBar
          actions={this.compileActions}
          activityPending={this.activityPending}
        />
      </UFOContainer>
    );
  }

  renderNewPreview = () => (
    <ScrollView contentContainerStyle={styles.actionBarIndent}>
      <View style={[ styles.cardsWrapper, styles.blockShadow ]}>
        <Text style={[ styles.infoPreviewTitle, styles.cardsTitle ]}>
          {this.props.t('driverLicenceCheckLabel')}
        </Text>
        <View style={styles.cardsContainer}>
          <UFOImage
            source={{ uri: this.frontImageUrl }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginBottom: 4 }}
            fallbackToImage={true}
          />
          <UFOImage
            source={{ uri: this.backImageUrl }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            fallbackToImage={true}
          />
        </View>
      </View>
    </ScrollView>
  );

  renderCameraMask = () => {
    const sample = this.captureState === captureStates.CAPTURE_FRONT
      ? images.driverCardFront
      : images.driverCardBack;

    const captureHint = this.captureState === captureStates.CAPTURE_FRONT
        ? this.props.t('driverLicenceFrontInputLabel')
        : this.props.t('driverLicenceBackInputLabel');

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
          <Text style={cameraMaskStyles.cardCameraLabel}>
            {captureHint.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  get compileActions() {
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
  }

  /*
   * Callback to camera ready state
  */
  onCameraReady = () => {
    this.isCameraAllowed = true;
  };

  /*
   * Cancel capturing and go back
  */
  doCancel = () => {
    this.props.navigation.popToTop();
  };

  /*
   * Reset new captured data
  */
  doReset = () => {
    this.frontImageUrl = null;
    this.backImageUrl = null;
    this.captureState = captureStates.CAPTURE_FRONT;
  };

  /*
   * Capture and handle photo
  */
  doCapture = async () => {
    const t = this.props.t;
    this.activityPending = true;
    const imageData = await this.cameraRef.current.takePicture();
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
        showWarning(t('cameraProcessingError', { message: error.message }));
      }
    );
  };

  /*
   * Save new images
  */
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
        const imgData = await downloadFromApi(document.reference);
        registerStore.dlCardFrontScan = imgData
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
        const imgData = await downloadFromApi(document.reference);
        registerStore.dlCardBackScan = imgData
          ? `data:image/png;base64,${imgData}`
          : null;
      }
    }

    const isSaved = await registerStore.save();
    this.activityPending = false;

    if (isSaved) {
      this.props.navigation.popToTop();
    }
  };
}

export default translate('register')(DriverCardEditorScreen);

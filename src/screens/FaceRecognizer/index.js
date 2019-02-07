import React, { Component, Fragment } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ImageEditor
} from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import { UFOImage, UFOContainer, UFOLoader } from './../../components/common';
import styles from './styles';
import { colors } from './../../utils/theme';
import { showToastError } from './../../utils/interaction';

const IS_IOS = Platform.OS === 'ios';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const SCREEN_AREA = SCREEN_WIDTH * SCREEN_HEIGHT;

@observer
class FaceRecognizer extends Component {
  @observable isCameraAllowed = false;
  @observable isScreenFocused = true;

  @observable detectedFaces = [];
  @observable capturedImgUri = null;
  @observable positionError = false;

  @observable isPending = false;
  @observable handlingWasFailure = false;

  cameraRef = null;
  faceResetTimer = null;
  positionErrorTimer = null;
  maxValidAngle = 20;
  maxValidFrameTrim = 20;
  maxValidFaceYaw = 30;
  /* percent relative to screen area */
  minValidFaceArea = 0.12;

  componentDidMount() {
    /* exist bug of RNCamera when screen is blur in navigator */
    this.props.navigation.addListener('willFocus', () => {
      this.isScreenFocused = true;
    });

    this.props.navigation.addListener('willBlur', () => {
      this.isScreenFocused = false;
      this.handlingWasFailure = false;
    });
  }

  componentWillUnmount() {
    clearTimeout(this.faceResetTimer);
    clearTimeout(this.positionErrorTimer);
  }

  render() {
    return (
      <UFOContainer>
        {this.capturedImgUri ? (
          <UFOImage
            source={{ uri: this.capturedImgUri }}
            style={styles.capturedImage}
            fallbackToImage={true}
          />
        ) : (
          <Fragment>
            {this.isScreenFocused && (
              <UFOCamera
                ref={ref => (this.cameraRef = ref)}
                onCameraReady={this.onCameraReady}
                onFacesDetected={this.onFacesDetected}
                onFaceDetectionError={this.onFaceDetectionError}
                showTorchBtn={false}
                defaultVideoQuality={RNCAMERA_CONSTANTS.VideoQuality['720p']}
                type={RNCAMERA_CONSTANTS.Type.front}
              />
            )}
            {!this.isPending && this.detectedFaces.map(face => (
              <View
                key={face.faceID}
                style={[ styles.faceArea, this.getFaceAreaStyles(face) ]}
              />
            ))}
            {this.renderMessage()}
          </Fragment>
        )}
        {this.renderActionPanel()}
        <UFOLoader isVisible={this.isPending} />
      </UFOContainer>
    );
  }

  renderActionPanel = () => {
    const { t, navigation } = this.props;
    const nextBtnLabel = navigation.getParam('nextBtnLabel');
    const allowCapture = this.detectedFaces.length && !this.isPending;

    return this.capturedImgUri ? (
      <View style={styles.actionPanel}>
        <TouchableHighlight
          onPress={this.resetCapture}
          underlayColor={colors.BG_DEFAULT}
          style={styles.actionBtn}
        >
          <Text style={styles.actionLabel}>
            {t('resetBtn')}
          </Text>
        </TouchableHighlight>
        <View style={styles.actionBtnSeparator} />
        <TouchableHighlight
          key="nextBtn"
          onPress={this.navToNext}
          underlayColor={colors.BG_DEFAULT}
          style={styles.actionBtn}
        >
          <Text style={styles.actionLabel}>
            {nextBtnLabel || t('nextBtn')}
          </Text>
        </TouchableHighlight>
      </View>
    ) : (
      <View style={styles.actionPanel}>
        <TouchableHighlight
          onPress={this.navBack}
          underlayColor={colors.BG_DEFAULT}
          style={styles.actionBtn}
        >
          <Text style={styles.actionLabel}>
            {t('Back')}
          </Text>
        </TouchableHighlight>
        <View style={styles.actionBtnSeparator} />
        <TouchableHighlight
          key="captureBtn"
          onPress={allowCapture ? this.captureFace : null}
          underlayColor={colors.BG_DEFAULT}
          style={[ styles.actionBtn, !allowCapture && styles.actionBtnDisabled ]}
        >
          <Text style={styles.actionLabel}>
            {t('captureBtn')}
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  renderMessage = () => {
    if (this.capturedImgUri || this.isPending) {
      return null;
    }

    let message;
    const description = this.props.navigation.getParam('description');
    const errorMessage = this.props.navigation.getParam('handlingErrorMessage');

    switch (true) {
      case !!this.positionError:
        message = this.positionError;
        break;
      case this.handlingWasFailure:
        message = errorMessage || this.props.t('handlingDefaultError');
        break;
      case !!description:
        message = description;
        break;
      default:
        message = null;
    }

    return message && (
      <Text style={styles.message}>
        {message}
      </Text>
    );
  };

  /*
   * callback when camera ready for using
  */
  onCameraReady = () => {
    this.isCameraAllowed = true;
  };

  /*
   * get styles for face frame
   * @param {Object} faceData
  */
  getFaceAreaStyles = faceData => {
    if (!faceData) {
      return null;
    }

    const position = this.getFacePosition(faceData);
    const faceAreaStyles = StyleSheet.create({
      area: {
        top: position.top,
        left: position.left,
        height: position.height,
        width: position.width
      }
    });

    return faceAreaStyles.area;
  };

  /*
   * get positions for face relative to screen
   * @param {Object} faceData
  */
  getFacePosition = faceData => {
    if (!faceData) {
      return null;
    }

    /* ios has a bug - data always returned regarding to landscape orientation and some bloated */
    const iosHorizontalCorrecting = 0.75;
    const iosVerticalCorrecting = 0.85;
    const height = IS_IOS ? faceData.bounds.size.width : faceData.bounds.size.height;
    const width = IS_IOS
      ? ( faceData.bounds.size.height * iosHorizontalCorrecting )
      : faceData.bounds.size.width;
    const top = IS_IOS
      ? ( faceData.bounds.origin.x * iosVerticalCorrecting )
      : faceData.bounds.origin.y;
    const left = IS_IOS
      ? ( faceData.bounds.origin.y + width * (1 - iosHorizontalCorrecting) / 2 )
      : faceData.bounds.origin.x;
    const bottom = SCREEN_HEIGHT - top - height;
    const right = SCREEN_WIDTH - left - width;

    return { top, left, bottom, right, width, height };
  };

  /*
   * RNCamera callback when face detected in camera
  */
  onFacesDetected = ({ faces = [] }) => {
    const isPositionInvalid = this.setFacePositionError(faces[0]);

    if (isPositionInvalid) {
      this.clearDetectedFaces();
      return;
    }

    clearTimeout(this.faceResetTimer);
    this.detectedFaces = faces;
    this.faceResetTimer = setTimeout(this.clearDetectedFaces, 1000);
  };

  /*
   * Validate face position, if invalid save error and return true (error wa setted)
   * @param {Object} faceData
  */
  setFacePositionError = faceData => {
    if (!faceData) {
      return false;
    }

    const facePosition = this.getFacePosition(faceData);
    const setError = message => {
      clearTimeout(this.positionErrorTimer);
      this.positionError = message;
      this.positionErrorTimer = setTimeout(() => (this.positionError = null), 1000);
    };

    if (faceData.rollAngle && Math.abs(faceData.rollAngle) > this.maxValidAngle) {
      setError( this.props.t('incorrectDevicePosition') );
      return true;
    }

    if (
      facePosition.left < -this.maxValidFrameTrim
      || facePosition.right < -this.maxValidFrameTrim
      || facePosition.top < -this.maxValidFrameTrim
      || facePosition.bottom < -this.maxValidFrameTrim
    ) {
      setError( this.props.t('incorrectFacePosition') );
      return true;
    }

    if (facePosition.height * facePosition.width < SCREEN_AREA * this.minValidFaceArea) {
      setError( this.props.t('incorrectFaceSize') );
      return true;
    }

    if (Math.abs(faceData.yawAngle) > this.maxValidFaceYaw) {
      setError( this.props.t('incorrectFaceYaw') );
      return true;
    }

    return false;
  };

  /*
   * handle error from RNCamera
   * @param {Object} error
  */
  onFaceDetectionError = error => {
    const message = error.message || this.props.t('error:unknown');
    showToastError(message);
  };

  /*
   * clear detected faces from screen store
  */
  clearDetectedFaces = () => {
    this.detectedFaces = [];
  };

  /*
   * capture and handle image
  */
  captureFace = async () => {
    if (!this.isCameraAllowed || !this.cameraRef || !this.isScreenFocused) {
      return;
    }

    this.isPending = true;
    const facePosition = this.getFacePosition( this.detectedFaces[0] );
    const options = {
      mirrorImage: true,
      orientation: 'portrait',
      fixOrientation: true
    };

    const { uri: cameraUri, width, height } = await this.cameraRef.takePicture(options);
    const withoutCropping = this.props.navigation.getParam('withoutCropping');
    const autohandling = this.props.navigation.getParam('autohandling');

    if (withoutCropping) {
      this.capturedImgUri = cameraUri;

      if (autohandling) {
        await this.handleCapture();
      }

      this.isPending = false;
      return;
    }

    const ratioX = width / SCREEN_WIDTH;
    const ratioy = height / SCREEN_HEIGHT;
    const cropFrame = {
      top: IS_IOS ? -24 : 24,
      bottom: IS_IOS ? 64 : 24,
      left: IS_IOS ? -24 : 0,
      right: IS_IOS ? 48 : 0
    };

    ImageEditor.cropImage(
      cameraUri,
      {
        offset: {
          x: (facePosition.left + cropFrame.left) * ratioX,
          y: (facePosition.top + cropFrame.top) * ratioy
        },
        size: {
          width: (facePosition.width + cropFrame.right) * ratioX,
          height: (facePosition.height + cropFrame.bottom) * ratioy
        }
      },
      async uri => {
        this.capturedImgUri = uri;

        if (autohandling) {
          await this.handleCapture();
        }

        this.isPending = false;
      },
      () => {
        this.capturedImgUri = cameraUri;
        this.isPending = false;
      }
    );
  };

  /*
   * Handle captured image
  */
  handleCapture = async () => {
    const handleFile = this.props.navigation.getParam('actionHandleFileAsync');

    if (typeof handleFile === 'function') {
      this.isPending = true;
      const isSuccess = await handleFile(this.capturedImgUri);
      this.isPending = false;

      if (!isSuccess) {
        this.handlingWasFailure = true;
        this.resetCapture();

        return false;
      }
    }

    return true;
  }

  /*
   * Navigate to previous screen
  */
  navBack = () => {
    const action = this.props.navigation.getParam('actionNavBack');

    if (typeof action === 'function') {
      action();
    }
  };

  /*
   * Handle image and navigate to next screen
  */
  navToNext = async () => {
    const autohandling = this.props.navigation.getParam('autohandling');
    const actionNavNext = this.props.navigation.getParam('actionNavNext');

    if (!autohandling) {
      const isSuccess = await this.handleCapture();

      if (!isSuccess) {
        return;
      }
    }

    if (typeof actionNavNext === 'function') {
      this.resetCapture();
      actionNavNext();
    }
  };

  /*
   * reset all capturing data
  */
  resetCapture = () => {
    this.detectedFaces = [];
    this.capturedImgUri = false;
    this.positionError = null;
  };
}

/*
 * declared only custom props like params for navigator
 * other supported props from HOCs see in doc for them
 */
FaceRecognizer.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        actionNavNext: PropTypes.func.isRequired,
        actionNavBack: PropTypes.func.isRequired,
        actionHandleFileAsync: PropTypes.func,
        description: PropTypes.string,
        handlingErrorMessage: PropTypes.string,
        nextBtnLabel: PropTypes.string,
        withoutCropping: PropTypes.bool,
        autohandling: PropTypes.bool
      })
    })
  })
};

export default translate('faceRecognizing')(FaceRecognizer);

import React, { Component, Fragment } from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { keys as screenKeys } from './../../navigators/helpers';
import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import { UFOImage, UFOContainer, UFOModalLoader } from './../../components/common';
import styles from './styles';
import { colors } from './../../utils/theme';
import { showToastError } from './../../utils/interaction';

const IS_IOS = Platform.OS === 'ios';

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
    clearTimeout(faceResetTimer);
    clearTimeout(positionErrorTimer);
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
        <UFOModalLoader isVisible={this.isPending} />
      </UFOContainer>
    );
  }

  renderActionPanel = () => {
    const { t, navigation } = this.props;
    const nextBtnLabel = navigation.getParam('nextBtnLabel');
    const allowCapture = this.detectedFaces.length && !this.isPending;
    // add more rules, maybe area size and position validation

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

    let mesage;
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
   * get position styles for face frame
   * @param {Object} faceData
  */
  getFaceAreaStyles = faceData => {
    if (!faceData) {
      return null;
    }

    /* ios has a bug - data always returned regarding to landscape orientation */
    const styles = StyleSheet.create({
      area: {
        top: IS_IOS ? faceData.bounds.origin.x : faceData.bounds.origin.y,
        left: IS_IOS ? faceData.bounds.origin.y : faceData.bounds.origin.x,
        height: IS_IOS ? faceData.bounds.size.width : faceData.bounds.size.height,
        width: IS_IOS ? faceData.bounds.size.height : faceData.bounds.size.width
      }
    });

    return styles.area;
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

    if (faceData.rollAngle && Math.abs(faceData.rollAngle) > this.maxValidAngle) {
      clearTimeout(this.positionErrorTimer);
      this.positionError = this.props.t('incorrectDevicePosition');
      this.positionErrorTimer = setTimeout(() => (this.positionError = null), 1000);
      return true;
    }

    if (false) {
      // check paddings
    }

    if (false) {
      // check square
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
    const imageData = await this.cameraRef.takePicture({
      mirrorImage: true,
      orientation: 'portrait',
      fixOrientation: true,
      /* use this option with camera type back to test with different faces */
      // rotateAngle: 270
    });
    this.capturedImgUri = imageData.uri;
    this.isPending = false;
  };

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
    const handleFile = this.props.navigation.getParam('actionHandleFileAsync');
    const actionNavNext = this.props.navigation.getParam('actionNavNext');

    if (typeof handleFile === 'function') {
      this.isPending = true;
      const isSuccess = await handleFile(this.capturedImgUri);
      this.isPending = false;
      
      if (!isSuccess) {
        this.handlingWasFailure = true;
        this.resetCapture();
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
        nextBtnLabel: PropTypes.string
      })
    })
  })
};

export default translate('faceRecognizing')(FaceRecognizer);

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
  @observable isTilt = false;

  @observable isPending = false;
  
  cameraRef = null;
  faceResetTimer = null;
  tiltResetTimer = null;
  maxValidAngle = 30;

  componentDidMount() {
    /* exist bug of RNCamera when screen is blur in navigator */
    this.props.navigation.addListener('willFocus', () => {
      this.isScreenFocused = true;
    });

    this.props.navigation.addListener('willBlur', () => {
      this.isScreenFocused = false;
    });
  }

  componentWillUnmount() {
    clearTimeout(faceResetTimer);
    clearTimeout(tiltResetTimer);
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
            {this.isTilt && (
              <Text style={styles.tiltTitle}>
                {this.props.t('incorrectDevicePosition')}
              </Text>
            )}
          </Fragment>
        )}
        {this.renderActionPanel()}
        <UFOModalLoader isVisible={this.isPending} />
      </UFOContainer>
    );
  }

  renderActionPanel = () => {
    const { t } = this.props;
    const allowCapture = this.detectedFaces.length && !this.isPending;
    // add more rules, maybe area size and position validation
    // add custtom btn labels from navigation params

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
            {t('nextBtn')}
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
  onFacesDetected = ({ faces }) => {
    const angle = _.get(faces[0], 'rollAngle');

    if (angle && Math.abs(angle) > this.maxValidAngle) {
      clearTimeout(this.tiltResetTimer);
      this.isTilt = true;
      this.tiltResetTimer = setTimeout(() => (this.isTilt = false), 1000);
      this.clearDetectedFaces();
      return;
    }

    clearTimeout(this.faceResetTimer);
    this.detectedFaces = faces;
    this.faceResetTimer = setTimeout(this.clearDetectedFaces, 1000);
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

      // sync below option with imageData.exif.Orientation in UFOCamera component
      // fixOrientation: true
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
   * Navigate to next screen
  */
  navToNext = () => {
    const action = this.props.navigation.getParam('actionNavNext');

    if (typeof action === 'function') {
      action();
    }
  };

  /*
   * reset all capturing data
  */
  resetCapture = () => {
    this.detectedFaces = [];
    this.capturedImgUri = false;
    this.isTilt = false;
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
      })
    })
  })
};

export default translate('faceRecognizing')(FaceRecognizer);

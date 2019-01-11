import React, { Component, Fragment } from 'react';
import { View, TouchableHighlight, Text, StyleSheet, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Orientation from 'react-native-orientation';
import _ from 'lodash';

import { keys as screenKeys } from './../../navigators/helpers';
import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import { UFOImage, UFOContainer, UFOModalLoader } from './../../components/common';
import styles from './styles';
import { colors } from './../../utils/theme';

const IS_IOS = Platform.OS === 'ios';

@observer
class FaceRecognizer extends Component {
  @observable isCameraAllowed = false;
  @observable detectedFaces = [];
  @observable capturedImgUri = null;
  @observable isPending = false;
  @observable isScreenFocused = false;
  cameraRef = null;
  faceResetTimer = null;
  maxValidAngle = 30;

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.isScreenFocused = true;
    });

    this.props.navigation.addListener('willBlur', () => {
      this.isScreenFocused = false;
    });

    Orientation.lockToPortrait();
    //Orientation.addOrientationListener((orientation) => {console.log('ORIENT', orientation);});
  }

  render() {
    /* exist bug of RNCamera when screen is blur in navigator */
    return this.isScreenFocused && (
      <UFOContainer>
        {this.capturedImgUri ? (
          <UFOImage
            source={{ uri: this.capturedImgUri }}
            style={styles.capturedImage}
            fallbackToImage={true}
          />
        ) : (
          <Fragment>
            <UFOCamera
              ref={ref => (this.cameraRef = ref)}
              onCameraReady={this.onCameraReady}
              type={RNCAMERA_CONSTANTS.Type.front}
              onFacesDetected={this.onFacesDetected}
              onFaceDetectionError={this.onFaceDetectionError}
              showTorchBtn={false}

              defaultVideoQuality={RNCAMERA_CONSTANTS.VideoQuality['720p']}
            />
            {!this.isPending && this.detectedFaces.map(face => (
              <View
                key={face.faceID}
                style={[ styles.faceArea, this.getFaceAreaStyles(face) ]}
              />
            ))}
          </Fragment>
        )}
        {this.renderActionPanel()}
        <UFOModalLoader isVisible={this.isPending} />
      </UFOContainer>
    );
  }

  renderActionPanel = () => {
    const allowCapture = this.detectedFaces.length && !this.isPending;
    // add more rules, maybe area size validation

    return this.capturedImgUri ? (
      <View style={styles.actionPanel}>
        <TouchableHighlight
          onPress={this.resetCapture}
          underlayColor={colors.BG_DEFAULT}
          style={styles.actionBtn}
        >
          <Text style={styles.actionLabel}>
            Reset
          </Text>
        </TouchableHighlight>
        <View style={styles.actionBtnSeparator} />
        <TouchableHighlight
          onPress={this.navToNext}
          underlayColor={colors.BG_DEFAULT}
          style={styles.actionBtn}
        >
          <Text style={styles.actionLabel}>
            To booking
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
            Back
          </Text>
        </TouchableHighlight>
        <View style={styles.actionBtnSeparator} />
        <TouchableHighlight
          onPress={allowCapture ? this.captureFace : null}
          underlayColor={colors.BG_DEFAULT}
          style={[ styles.actionBtn, !allowCapture && styles.actionBtnDisabled ]}
        >
          <Text style={styles.actionLabel}>
            Capture
          </Text>
        </TouchableHighlight>
      </View>
    );
  };

  onCameraReady = () => {
    this.isCameraAllowed = true;
  };

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

  onFacesDetected = ({ faces }) => {
    const angle = _.get(faces[0], 'rollAngle');

    if (!angle || Math.abs(angle) > this.maxValidAngle) {
      return;
    }

    clearTimeout(this.faceResetTimer);
    this.detectedFaces = faces;
    this.faceResetTimer = setTimeout(this.clearDetectedFaces, 1000);
  };

  onFaceDetectionError = error => {
    // implement somethisng from interactions
    console.log('FACE ERROR', error);
  };

  clearDetectedFaces = () => {
    this.detectedFaces = [];
  };

  captureFace = async () => {
    if (!this.isCameraAllowed || !this.cameraRef) {
      return;
    }

    this.isPending = true;
    const imageData = await this.cameraRef.takePicture({
      mirrorImage: true,
      orientation: 'portrait'
    });
    this.capturedImgUri = imageData.uri;
    this.isPending = false;
  };

  navBack = () => {
    this.props.navigation.navigate(screenKeys.Home);
  };

  navToNext = () => {
    // we can throw navNext action outside
    this.props.navigation.navigate(screenKeys.BookingStepBook);
  };

  resetCapture = () => {
    this.detectedFaces = [];
    this.capturedImgUri = false;
  };
}

export default FaceRecognizer;

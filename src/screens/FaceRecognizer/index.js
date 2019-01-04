import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import UFOCamera, { RNCAMERA_CONSTANTS } from './../../components/UFOCamera';
import styles from './styles';

@observer
class FaceRecognizer extends Component {
  @observable isCameraAllowed = false;

  render() {
    return (
      <UFOCamera
        ref={ref => (this.cameraRef = ref)}
        onCameraReady={() => (this.isCameraAllowed = true)}

        onFacesDetected={this.onFacesDetected}
        onFaceDetectionError={this.onFaceDetectionError}
        faceDetectionLandmarks={RNCAMERA_CONSTANTS.FaceDetection.Landmarks.all}
        faceDetectionMode={RNCAMERA_CONSTANTS.FaceDetection.Mode.accurate}
      />
    );
  }

  onFacesDetected = ({ faces }) => {
    console.log('FACES', faces);
  };

  onFaceDetectionError = (error) => {
    console.log('FACE ERROR', error);
  };
}

export default FaceRecognizer;

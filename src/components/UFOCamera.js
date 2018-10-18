import React from 'react';
import { StyleSheet } from 'react-native';
import { translate } from 'react-i18next';
import { RNCamera } from 'react-native-camera';
import ImageRotate from 'react-native-image-rotate';
import PropTypes from 'prop-types';

import { showWarning } from './../utils/interaction';

export const RNCAMERA_CONSTANTS = RNCamera.Constants;

const styles = StyleSheet.create({
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

class UFOCamera extends React.Component {
  constructor(props) {
    super(props);
    props.getCaptureFunc(this.takePicture);
  }

  rotateImage = imageData => new Promise((resolve, reject) => {
    const { uri, width, height } = imageData;
    ImageRotate.rotateImage(uri, 90, res => {
      imageData.uri = res;
      imageData.width = height;
      imageData.height = width;

      return resolve(imageData);
    }, err => reject(err));
  })

  takePicture = async (customOptions = {}) => {
    try {
      if (!this.camera) {
        showWarning(this.props.t('Registration:CameraNotAvailable'));

        return null;
      }
      const options = {
        width: 2048,
        quality: 0.8,
        base64: false,
        exif: true,
        doNotSave: false,
        ...customOptions,
      };
      const imageData = await this.camera.takePictureAsync(options);
      // For all samsung device the picture is rotated so this code fix this issues
      if (imageData.exif.Orientation === 6) {
        await this.rotateImage(imageData);
      }

      return imageData;
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  render() {
    const { t, ...restCameraProps } = this.props;
  
    return (
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        permissionDialogTitle={t('register:cameraPermissionTitle')}
        permissionDialogMessage={t('register:cameraPermissionMessage')}
        { ...restCameraProps }
        ref={ref => (this.camera = ref)}
      />
    );
  }
}

UFOCamera.propTypes = {
  getCaptureFunc : PropTypes.func.isRequired,
};

export default translate('translations')(UFOCamera);

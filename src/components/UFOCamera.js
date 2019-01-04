import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImageRotate from 'react-native-image-rotate';
import PropTypes from 'prop-types';
import i18n from 'i18next';

import { showWarning } from './../utils/interaction';
import { checkAndRequestCameraPermission } from './../utils/permissions';
import { UFOIcon_old } from './common';
import { icons, sizes, fonts, colors } from './../utils/global';

export const RNCAMERA_CONSTANTS = RNCamera.Constants;
const FLASH_MODE_ITEMS = [
  {
    mode: RNCAMERA_CONSTANTS.FlashMode.auto,
    getLabel: () => i18n.t('common:modeAuto'),
    index: 0
  },
  {
    mode: RNCAMERA_CONSTANTS.FlashMode.on,
    getLabel: () => i18n.t('common:modeOn'),
    index: 1
  },
  {
    mode: RNCAMERA_CONSTANTS.FlashMode.off,
    getLabel: () => i18n.t('common:modeOff'),
    index: 2
  }
];

const styles = StyleSheet.create({
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  torchBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    opacity: 0.9,
    paddingHorizontal: 24,
    paddingVertical: 4,
    marginTop: 60
  },
  torchLabel: {
    color: colors.INVERTED_TEXT,
    fontSize: 16,
    fontFamily: fonts.LIGHT,
    marginLeft: 4
  },
  torchShadow: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  }
});

export default class UFOCamera extends React.Component {
  constructor() {
    super();
    this.camera = null;
    this.state = {
      hasPermit: false,
      flashMode: FLASH_MODE_ITEMS[0]
    };
  }

  async componentDidMount() {
    const { forbiddenCallback } = this.props;
    const hasPermit = await checkAndRequestCameraPermission();

    if (typeof forbiddenCallback === 'function' && !hasPermit) {
      forbiddenCallback();
    }
    this.setState({ hasPermit });
  }

  render() {
    const { showTorchBtn, torchBtnTopIndent, ...restCameraProps } = this.props;
    const { hasPermit, flashMode } = this.state;

    return hasPermit ? (
      <RNCamera
        style={styles.preview}
        type={RNCAMERA_CONSTANTS.Type.back}
        flashMode={flashMode.mode}
        {...restCameraProps}
        ref={ref => (this.camera = ref)}
      >
        {showTorchBtn && (
          <TouchableOpacity
            onPress={this.changeFlashMode}
            style={[ styles.torchBtn, torchBtnTopIndent && { marginTop: torchBtnTopIndent } ]}
            activeOpacity={1}
          >
            <UFOIcon_old
              icon={icons.TORCH}
              size={sizes.SMALL}
              color={colors.INVERTED_TEXT}
              style={styles.torchShadow}
            />
            <Text style={[ styles.torchLabel, styles.torchShadow ]}>
              {flashMode.getLabel()}
            </Text>
          </TouchableOpacity>
        )}
      </RNCamera>
    ) : null;
  }

  changeFlashMode = () => {
    const currentIndex = this.state.flashMode.index;
    const nextIndex = currentIndex + 1 >= FLASH_MODE_ITEMS.length
      ? 0
      : currentIndex + 1;
    this.setState({ flashMode: FLASH_MODE_ITEMS[nextIndex] });
  };

  rotateImage = (imageData, angle = 90) => new Promise((resolve, reject) => {
    const { uri, width, height } = imageData;

    ImageRotate.rotateImage(uri, angle, res => {
      imageData.uri = res;
      imageData.width = height;
      imageData.height = width;

      return resolve(imageData);
    }, err => reject(err));
  });

  takePicture = async (customOptions = {}) => {
    try {
      if (!this.camera) {
        showWarning(i18n.t('Registration:CameraNotAvailable'));

        return null;
      }

      const options = {
        width: 2048,
        quality: 0.8,
        base64: false,
        exif: true,
        doNotSave: false,
        ...customOptions
      };
      const imageData = await this.camera.takePictureAsync(options);

      // For all samsung device the picture is rotated so this code fix this issues
      if (imageData.exif.Orientation === 6) {
        return await this.rotateImage(imageData);
      }

      // Same fix but for frontal camera (needed more tests)
      if (imageData.exif.Orientation === 8) {
        return await this.rotateImage(imageData, 270);
      }

      return imageData;
    } catch (err) {
      console.error(err);

      return null;
    }
  };
}

UFOCamera.defaultProps = {
  showTorchBtn: true
};

UFOCamera.propTypes = {
  forbiddenCallback: PropTypes.func,
  torchBtnTopIndent: PropTypes.number,
  showTorchBtn: PropTypes.bool,
  ...RNCamera.propTypes
};

import React from "react";
import { View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImageRotate from 'react-native-image-rotate';

import { UFOText } from './common'


export default class UFOCamera extends React.Component {


    capture = async (t) => {

        if (!this.camera) {
            showWarning(t("Registration:CameraNotAvailable"))
            return
        }
        this.activityPending = true
        const options = { quality: 1, base64: false, exif: true, doNotSave: false };
        //Take photo
        let fullImage = await this.camera.takePictureAsync(options)
        const { uri, width, height, exif } = fullImage;
        if (exif && exif.Orientation === 6) {
            //For all samsung device the picture is rotated so this code fix this issues
            ImageRotate.rotateImage(uri, 90, (uri) => {
                this.props.handlePhoto(uri, height, width)
            },
                (error) => {
                    console.error(error);
                }
            )
        } else {
            this.props.handlePhoto(uri, width, height)
        }
    }


    render() {

        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.preview}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.auto}
                permissionDialogTitle={t('register:cameraPermissionTitle')}
                permissionDialogMessage={t('register:cameraPermissionMessage')}
            />
        );
    }
}

const styles = StyleSheet.create({
    preview: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
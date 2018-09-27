import React from "react";
import { View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { UFOText } from './common'


export default class UFOMessageComponent extends React.Component {
    render() {

        let text = this.props.text ? this.props.text : ""
        return (
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.preview}
                autoFocus={RNCamera.Constants.AutoFocus.auto}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.auto}
                permissionDialogTitle={t('register:cameraPermissionTitle')}
                permissionDialogMessage={t('register:cameraPermissionMessage')}
            />
        );
    }
}

constactionStyles = StyleSheet.create({
    preview: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, StyleSheet } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { RNCamera } from 'react-native-camera';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";



import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOImage } from '../../components/common'
import { screens, actionStyles, icons } from '../../utils/global'
import { inspectStore } from "../../stores";
import UFOCard from "../../components/UFOCard";
import { Body } from "native-base";


const window = Dimensions.get('window');
const DEVICE_WIDTH = window.width
const DEVICE_HEIGHT = window.height

@observer
class CaptureDamageScreen extends Component {

  @observable documentUri = null
  @observable activityPending = false

  componentDidMount() {
    this.documentUri = null
  }

  @action
  doCapture = async (t) => {

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
      ImageRotate.rotateImage(uri, 90, (uri) => {
        this.documentUri = uri
        this.activityPending = false
      },
        (error) => {
          console.error(error);
        }
      )
    } else {
      this.documentUri = uri
      this.activityPending = false
    }
  }

  @action
  doSave = async (t) => {
    this.activityPending = true
    if (this.documentUri) {
      inspectStore.documentUri = this.documentUri
      if (await inspectStore.uploadDamageDocument()) {
        this.props.navigation.navigate(screens.INSPECT_COMMENT.name)
      }
    }
    this.activityPending = false
  }

  renderBody = (t, navigation) => {
    return this.documentUri ? this.renderBodyCheck(t, navigation) : this.renderBodyCapture(t, navigation)
  }

  renderBodyCapture = (t, navigation) => {
    return (
      <View style={styles.container}>
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
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.INSPECT_CAPTURE} logo />

      </View>
    )
  }

  renderBodyCheck = (t, navigation) => {
    return (

      <KeyboardAwareScrollView>
        <View style={{ padding: 20, flexDirection: 'column', justifyContent: 'flex-start' }}>
          <UFOCard title={t('inspect:captureCheckGuidance')} >
            <Body>
              <UFOImage source={{ uri: this.documentUri }} style={{ width: DEVICE_WIDTH * 0.7, height: DEVICE_HEIGHT * 0.7, alignSelf: 'center' }} />
            </Body>
          </UFOCard >
        </View >
      </KeyboardAwareScrollView>
    )
  }

  render() {
    const { t, navigation } = this.props;

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.popToTop()
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: this.documentUri ? actionStyles.ACTIVE : actionStyles.TODO,
        icon: this.documentUri ? icons.NEW_CAPTURE : icons.CAPTURE,
        onPress: async () => {
          this.documentUri ? this.documentUri = null : this.doCapture(t)
        }
      }
    ]

    if (this.documentUri) {
      actions.push({
        style: this.documentUri ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.NEXT,
        onPress: () => this.doSave(t)
      })
    }



    return (
      <UFOContainer image={screens.INSPECT_CAPTURE.backgroundImage}>
        {this.renderBody(t, navigation)}
        <UFOActionBar actions={actions} activityPending={this.activityPending} />
      </UFOContainer >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default translate("translations")(CaptureDamageScreen);


import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { RNCamera } from 'react-native-camera';


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import driveStore from '../../stores/driveStore'
import inspectStore from "../../stores/inspectStore";


const window = Dimensions.get('window');
const DEVICE_WIDTH = window.width
const DEVICE_HEIGHT = window.height

@observer
class CaptureDamageScreen extends Component {

  @observable documentUri = null

  componentDidMount() {
    this.documentUri = null
  }

  @action
  doCapture = async (t) => {

    if (!this.camera) {
      showWarning(t("Registration:CameraNotAvailable"))
      return
    }

    const options = { quality: 1, base64: true, fixOrientation: true, doNotSave: true };
    //Take photo
    let fullImage = await this.camera.takePictureAsync(options)
    //Crop Image
    const { uri, width, height } = fullImage;
    inspectStore.documentUri = uri
  }

  @action
  doSave = async (t) => {
    if (this.documentUri) {
      inspectStore.documentUri = this.documentUri
      if (await inspectStore.uploadDamageDocument()) {
        this.props.navigation.navigate(screens.INSPECT_COMMENT.name)
      }
    }
  }

  renderBody = (t) => {
    return tnis.documentUri ? this.renderBodyCheck(t) : this.renderBodyCapture(t)
  }

  renderBodyCapture = (t) => {
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
      </View>
    )
  }

  renderBodyCheck = (t) => {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
        <UFOText style={{ padding: 20 }}>{t('inspect:captureCheckGuidance')}</UFOText>
        <View style={{ paddingLeft: DEVICE_WIDTH / 4 }}>
          <UFOImage source={{ uri: this.documentUri }} style={{
            width: DEVICE_WIDTH / 2, height: DEVICE_HEIGHT / 2
          }} />
        </View>
      </View>
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
        style: this.documentUri ? actionStyles.ACTIVE : actionStyles.TODO,
        icon: this.documentUri ? icons.NEW_CAPTURE : icons.CAPTURE,
        onPress: async () => {
          this.documentUri ? this.documentUri = null : this.doCapture(t)
        }
      },
      {
        style: this.documentUri ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.NEXT,
        onPress: () => this.doSave(t)
      },
    ]



    return (
      <UFOContainer>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('inspect:captureDamageTitle', { rental: driveStore.rental })} />
        {this.renderBody(t)}
        <UFOActionBar actions={actions} />
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


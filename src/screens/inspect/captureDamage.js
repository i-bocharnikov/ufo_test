import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Dimensions, View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UFOCamera from './../../components/UFOCamera';
import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, dims } from '../../utils/global'
import { inspectStore } from "../../stores";
import UFOCard from "../../components/UFOCard";
import { Body } from "native-base";
import { checkAndRequestCameraPermission } from "../../utils/permissions";

const window = Dimensions.get('window');
const DEVICE_WIDTH = window.width
const DEVICE_HEIGHT = window.height
@observer
class CaptureDamageScreen extends Component {

  @observable documentUri = null
  @observable activityPending = false
  @observable isCameraAllowed = false

  async componentDidMount() {
    this.documentUri = null
    //this.isCameraAllowed = await checkAndRequestCameraPermission()
  }

  @action
  doCapture = async () => {
    this.activityPending = true
    const imageData = await this.cameraRef.takePicture();
    this.documentUri = imageData.uri;
    this.activityPending = false;
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
        <UFOHeader
          transparent
          t={t}
          navigation={navigation}
          currentScreen={screens.INSPECT_CAPTURE}
          logo
        />
        <UFOCamera
          onCameraReady={() => (this.isCameraAllowed = true)}
          ref={ref => (this.cameraRef = ref)}
          forbiddenCallback={navigation.goBack}
        />
      </View>
    );
  }

  renderBodyCheck = (t, navigation) => {
    return (
      <KeyboardAwareScrollView>
        <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.INSPECT_CAPTURE} logo />
        <View style={{ paddingTop: 10, paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
          <UFOCard title={t('inspect:captureCheckGuidance')} >
            <Body>
              <UFOImage source={{ uri: this.documentUri }} style={{ width: dims.DEVICE_WIDTH * 0.7, height: dims.DEVICE_HEIGHT * 0.5, alignSelf: 'center' }} />
            </Body>
          </UFOCard>
        </View>
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
        style: this.isCameraAllowed ? this.documentUri ? actionStyles.ACTIVE : actionStyles.TODO : actionStyles.DISABLE,
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


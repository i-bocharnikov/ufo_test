import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import _ from 'lodash';

import { inspectStore } from './../../stores';
import UFOCamera from './../../components/UFOCamera';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOImage, UFOProgressLine } from './../../components/common';
import UFOCard from './../../components/UFOCard';
import { screens, actionStyles, icons, dims } from './../../utils/global';
import { uploadToApiWithProgress } from './../../utils/api';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  bodyCheckContent: {
    paddingTop: 10,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  bodyCheckImage: {
    width: dims.DEVICE_WIDTH * 0.7,
    height: dims.DEVICE_HEIGHT * 0.5,
    alignSelf: 'center'
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },
  progressBar: {
    position: 'absolute',
    bottom: 0
  }
});

@observer
class CaptureDamageScreen extends Component {
  @observable documentUri = null;
  @observable activityPending = false;
  @observable isCameraAllowed = false;
  @observable loadingProgress = 0;

  render() {
    return (
      <UFOContainer image={screens.INSPECT_CAPTURE.backgroundImage}>
        {this.documentUri ? this.renderBodyCheck() : this.renderBodyCapture()}
        <UFOActionBar
          actions={this.getComputedActions()}
          activityPending={this.activityPending}
        />
        {!!this.loadingProgress && (
          <UFOProgressLine
            style={styles.progressBar}
            progress={this.loadingProgress}
          />
        )}
      </UFOContainer>
    );
  }

  renderBodyCapture = () => {
    const { t, navigation } = this.props;

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
  };

  renderBodyCheck = () => {
    const { t, navigation } = this.props;

    return (
      <ScrollView>
        <UFOHeader
          transparent
          t={t}
          navigation={navigation}
          currentScreen={screens.INSPECT_CAPTURE}
          logo
        />
        <View style={styles.bodyCheckContent}>
          <UFOCard title={t('inspect:captureCheckGuidance')}>
            <View style={styles.imageWrapper}>
              <UFOImage
                source={{ uri: this.documentUri }}
                style={styles.bodyCheckImage}
              />
            </View>
          </UFOCard>
        </View>
      </ScrollView>
    );
  };

  getComputedActions = () => {
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: this.doCancel
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: this.doBack
      },
      {
        style: this.isCameraAllowed
          ? this.documentUri
            ? actionStyles.ACTIVE
            : actionStyles.TODO
          : actionStyles.DISABLE,
        icon: this.documentUri ? icons.NEW_CAPTURE : icons.CAPTURE,
        onPress: this.documentUri ? this.resetCapture : this.doCapture
      }
    ];

    if (this.documentUri) {
      actions.push({
        style: this.documentUri ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.NEXT,
        onPress: this.doSave
      });
    }

    return actions;
  };

  @action
  doCapture = async () => {
    this.activityPending = true;
    const imageData = await this.cameraRef.takePicture({ width: 1920 });
    this.documentUri = imageData.uri;
    this.activityPending = false;
  };

  @action
  resetCapture = () => {
    this.loadingProgress = 0;
    this.documentUri = null;
    inspectStore.documentReference = null;
  };

  @action
  doSave = async () => {
    if (!this.documentUri) {
      return;
    }

    if (inspectStore.documentReference) {
      this.props.navigation.navigate(screens.INSPECT_COMMENT.name);
      return;
    }

    this.activityPending = true;
    const response = await uploadToApiWithProgress(
      this.documentUri,
      this.progressListener,
      {
        domain: 'car_damage',
        format: 'one_side',
        type: 'car_damage',
        sub_type: 'front_side'
      },
      true
    );
    this.activityPending = false;

    if (response.isSuccess && _.has(response, 'data.document.reference')) {
      inspectStore.documentReference = response.data.document.reference;
      this.props.navigation.navigate(screens.INSPECT_COMMENT.name);
    }
  };

  @action
  doCancel = () => {
    this.resetCapture();
    this.props.navigation.popToTop();
  };

  @action
  doBack = () => {
    this.resetCapture();
    this.props.navigation.pop();
  };

  progressListener = percent => {
    this.loadingProgress = percent;
  };
}

export default translate()(CaptureDamageScreen);

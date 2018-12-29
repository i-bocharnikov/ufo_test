import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Dimensions, View, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import UFOHeader from '../../components/header/UFOHeader';
import UFOActionBar from '../../components/UFOActionBar';
import { UFOContainer, UFOText, UFOImage, UFOTextInput_old } from '../../components/common';
import { screens, actionStyles, icons, colors, dims } from '../../utils/global';
import { driveStore, inspectStore } from '../../stores';
import UFOCard from '../../components/UFOCard';
const markerImage = require('../../assets/images/marker.png');

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const CAMERA_RATIO = 4 / 3;
const THUMB_WIDTH = DEVICE_WIDTH / 3;
const THUMB_HEIGHT = THUMB_WIDTH * CAMERA_RATIO;

@observer
class CommentDamageScreen extends Component {

  @observable comment = null;

  componentDidMount() {
    comment = null;
  }

  renderBody(t) {
    const carModel = driveStore.rental
      ? driveStore.rental.car
        ? driveStore.rental.car.car_model
        : null
      : null;
    return (
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'center'
        }}
      >
        <UFOCard title={t('inspect:commentGuidance')}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignContent: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignContent: 'center'
              }}
            >
              <UFOImage
                source={{ reference: inspectStore.documentReference }}
                style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
              />
              <UFOImage
                style={{ width: DEVICE_WIDTH / 3, height: DEVICE_WIDTH / 6 }}
                source={{ uri: carModel.image_top_h_url }}
              >
                <UFOImage
                  style={{
                    position: 'relative',
                    left: inspectStore.relativePositionX * 100 - 3 + '%',
                    top: inspectStore.relativePositionY * 100 - 3 + '%',
                    width: 10,
                    height: 10
                  }}
                  source={markerImage}
                />
              </UFOImage>
            </View>
            <View style={{ paddingTop: 10 }}>
              <UFOTextInput_old
                autofocus
                value={this.comment}
                autoCorrect={true}
                placeholder={t('inspect:commentPlaceholder')}
                multiline={true}
                numberOfLines={4}
                onChangeText={text => (this.comment = text)}
              />
            </View>
          </View>
        </UFOCard>
      </View>
    );
  }

  @action
  doSave = async t => {
    inspectStore.comment = this.comment;
    if (inspectStore.addCarDamage()) {
      this.props.navigation.popToTop();
    }
  };

  render() {
    const { t, navigation } = this.props;

    const actions = [
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
        style: this.comment ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SAVE,
        onPress: () => this.doSave(t)
      }
    ];

    return (
      <UFOContainer image={screens.INSPECT_COMMENT.backgroundImage}>
        <UFOHeader
          transparent
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('inspect:commentDamageTitle', { rental: driveStore.rental })}
        />
        {this.renderBody(t)}
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate('translations')(CommentDamageScreen);

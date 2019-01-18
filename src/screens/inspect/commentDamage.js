import React, { Component } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { driveStore, inspectStore } from './../../stores';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar, { ACTION_BAR_HEIGHT } from './../../components/UFOActionBar';
import UFOCard from './../../components/UFOCard';
import { UFOContainer, UFOImage, UFOTextInput } from './../../components/common';
import { screens, actionStyles, icons, colors, dims } from './../../utils/global';
import { images, textThemes } from './../../utils/theme';

const DEVICE_WIDTH = Dimensions.get('window').width;
const CAMERA_RATIO = 4 / 3;
const THUMB_WIDTH = DEVICE_WIDTH / 3;
const THUMB_HEIGHT = THUMB_WIDTH * CAMERA_RATIO;

const styles = StyleSheet.create({
  body: {
    paddingTop: 12,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL,
    paddingBottom: ACTION_BAR_HEIGHT
  },
  cardInner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  descriptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center'
  },
  marker: {
    position: 'relative',
    width: 10,
    height: 10
  },
  inputWrapper: {
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 5
  },
  input: {
    ...textThemes.SP_REGULAR,
    color: colors.TEXT.string(),
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: colors.ACTIVE.string(),
    height: 64
  }
});

@observer
class CommentDamageScreen extends Component {
  @observable comment = '';
  scrollContainerRef = null;

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  render() {
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
        onPress: () => this.doSave()
      }
    ];

    return (
      <UFOContainer image={screens.INSPECT_COMMENT.backgroundImage}>
        <UFOHeader
          t={this.props.t}
          navigation={this.props.navigation}
          transparent={true}
          currentScreen={screens.DRIVE}
          title={this.props.t('inspect:commentDamageTitle', { rental: driveStore.rental })}
        />
        {this.renderBody()}
        <KeyboardSpacer />
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }

  renderBody() {
    const carModel = (driveStore.rental && driveStore.rental.car)
      ? driveStore.rental.car.car_model
      : null;

    return (
      <ScrollView
        contentContainerStyle={styles.body}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        ref={ref => (this.scrollContainerRef = ref)}
      >
        <UFOCard title={this.props.t('inspect:commentGuidance')}>
          <View style={styles.cardInner}>
            <View style={styles.descriptionWrapper}>
              <UFOImage
                source={{ reference: inspectStore.documentReference }}
                style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }}
              />
              <UFOImage
                style={{ width: DEVICE_WIDTH / 3, height: DEVICE_WIDTH / 6 }}
                source={{ uri: carModel.image_top_h_url }}
              >
                <UFOImage
                  style={[
                    styles.marker,
                    {
                      left: `${inspectStore.relativePositionX * 100 - 3}%`,
                      top: `${inspectStore.relativePositionY * 100 - 3}%`
                    }
                  ]}
                  source={images.markerImage}
                />
              </UFOImage>
            </View>
            <UFOTextInput
              value={this.comment}
              onChangeText={text => (this.comment = text)}
              autoFocus={true}
              placeholder={this.props.t('inspect:commentPlaceholder')}
              multiline={true}
              numberOfLines={4}
              style={styles.input}
              wrapperStyle={styles.inputWrapper}
              placeholderColor={colors.ACTIVE.string()}
            />
          </View>
        </UFOCard>
      </ScrollView>
    );
  }

  @action
  doSave = async () => {
    inspectStore.comment = this.comment;

    if (inspectStore.addCarDamage()) {
      this.props.navigation.popToTop();
    }
  };

  keyboardDidShow = () => {
    if (this.scrollContainerRef) {
      /* wait when keyboard animation will be ended */
      setTimeout(this.scrollContainerRef.scrollToEnd, 500);
    }
  };
}

export default translate('translations')(CommentDamageScreen);

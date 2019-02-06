import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Dimensions, RefreshControl, View } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import UFOHeader from '../../components/header/UFOHeader';
import UFOActionBar from '../../components/UFOActionBar';
import { UFOContainer } from '../../components/common';
import {
  screens,
  actionStyles,
  icons,
  colors,
  dims,
  backgrounds
} from '../../utils/global';
import { driveStore, guideStore } from '../../stores';
import UFOCard from '../../components/UFOCard';
import UFOSlider from '../../components/UFOSlider';
import { NavigationEvents } from 'react-navigation';

@observer
class FindScreen extends Component {
  @observable guideIndex = 0;
  @observable refreshing = false;

  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    this.refreshing = true;
    await guideStore.listFindGuides();
    this.refreshing = false;
  };

  renderGuide({ item }) {
    return (
      <UFOCard
        key={item.reference}
        title={item.title}
        text={item.description}
        imageSource={guideStore.hasImage(item) ? { uri: item.media_url } : null}
        videoSource={guideStore.hasVideo(item) ? { uri: item.media_url } : null}
      />
    );
  }

  onSnapToItem = async index => {
    this.guideIndex = index;
  };

  doCarFound = async () => {
    this.activityPending = true;
    if (driveStore.carFound()) {
      this.props.navigation.navigate(screens.DRIVE.name);
    }
    this.activityPending = false;
  };

  render() {
    const { t, navigation } = this.props;
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.goBack()
      },
      {
        style: driveStore.rental
          ? driveStore.rental.car_found
            ? actionStyles.DONE
            : actionStyles.TODO
          : actionStyles.DISABLE,
        icon: icons.FOUND,
        onPress: this.doCarFound
      }
    ];

    const _RefreshControl = (
      <RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />
    );

    const guides = guideStore.findGuides;

    return (
      <UFOContainer image={backgrounds.DRIVE001}>
        <NavigationEvents onWillFocus={() => this.refresh()} />
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('guide:findTitle', { rental: driveStore.rental })}
        />
        <KeyboardAwareScrollView refreshControl={_RefreshControl}>
          <View style={{ paddingTop: dims.CONTENT_PADDING_TOP }}>
            <UFOSlider
              data={guides}
              renderItem={this.renderGuide}
              onSnapToItem={this.onSnapToItem}
            />
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate('translations')(FindScreen);

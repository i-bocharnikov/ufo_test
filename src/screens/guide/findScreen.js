import React, { Component } from 'react';
import { RefreshControl, View, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import { Popup } from 'react-native-map-link';
import _ from 'lodash';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar, { ACTION_BAR_HEIGHT } from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import {
  screens,
  actionStyles,
  icons,
  dims,
  backgrounds
} from './../../utils/global';
import { driveStore, guideStore } from './../../stores';
import UFOCard from './../../components/UFOCard';
import UFOSlider from './../../components/UFOSlider';
import { textThemes } from './../../utils/theme';

const mapDialogStyles = StyleSheet.create({
  image: {
    height: 36,
    width: 36,
    borderRadius: 18
  },
  itemText: {
    ...textThemes.SP_REGULAR,
    fontSize: 15
  },
  titleText: {
    ...textThemes.SP_REGULAR,
    fontSize: 18
  },
  subtitleText: {
    ...textThemes.SP_LIGHT,
    fontSize: 15
  },
  cancelButtonText: {
    ...textThemes.SP_REGULAR,
    fontSize: 18
  }
});

@observer
class FindScreen extends Component {
  @observable guideIndex = 0;
  @observable refreshing = false;
  @observable isMapsDialogVisible = false;
  screenFocusListener = null;

  componentDidMount() {
    this.refresh();
    this.screenFocusListener = this.props.navigation.addListener('didFocus', this.refresh);
  }

  componentWillUnmount() {
    this.screenFocusListener.remove();
  }

  render() {
    const { t, navigation } = this.props;

    return (
      <UFOContainer image={backgrounds.DRIVE001}>
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('guide:findTitle', { rental: driveStore.rental })}
        />
        <ScrollView refreshControl={this.refreshControl()}>
          <View style={{
            paddingTop: dims.CONTENT_PADDING_TOP,
            paddingBottom: ACTION_BAR_HEIGHT
          }}>
            <UFOSlider
              data={guideStore.findGuides}
              renderItem={this.renderGuide}
              onSnapToItem={this.onSnapToItem}
            />
          </View>
        </ScrollView>
        <UFOActionBar actions={this.compiledActions} />
        {this.latitude && this.longitude && (
          <Popup
            isVisible={this.isMapsDialogVisible}
            onCancelPressed={this.closeMapDialog}
            onAppPressed={this.closeMapDialog}
            onBackButtonPressed={this.closeMapDialog}
            options={{
              latitude: this.latitude,
              longitude: this.longitude,
              dialogTitle: t('guide:mapDialogTitle'),
              dialogMessage: t('guide:mapDialogMessage'),
              cancelText: t('common:cancelBtn')
            }}
            style={mapDialogStyles}
          />
        )}
      </UFOContainer>
    );
  }

  refreshControl = () => (
    <RefreshControl
      refreshing={this.refreshing}
      onRefresh={this.refresh}
    />
  );

  renderGuide = ({ item }) => (
    <UFOCard
      key={item.reference}
      title={item.title}
      text={item.description}
      imageSource={guideStore.hasImage(item) ? { uri: item.media_url } : null}
      videoSource={guideStore.hasVideo(item) ? { uri: item.media_url } : null}
    />
  );

  get compiledActions() {
    const currentGuide = guideStore.findGuides[this.guideIndex] || {};
    const actions = [];

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => this.props.navigation.goBack()
    });

    if (currentGuide.media_type === 'external_map' && this.latitude && this.longitude) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.FIND,
        onPress: this.openMapDialog
      });
    }

    actions.push({
      style: driveStore.rental
        ? driveStore.rental.car_found
          ? actionStyles.DONE
          : actionStyles.TODO
        : actionStyles.DISABLE,
      icon: icons.FOUND,
      onPress: this.doCarFound
    });

    return actions;
  }

  get latitude() {
    return _.get(driveStore, 'rental.location.latitude');
  }

  get longitude() {
    return _.get(driveStore, 'rental.location.longitude');
  }

  refresh = async () => {
    this.refreshing = true;
    await guideStore.listFindGuides();
    this.refreshing = false;
  };

  doCarFound = async () => {
    this.activityPending = true;
    if (driveStore.carFound()) {
      this.props.navigation.navigate(screens.DRIVE.name);
    }
    this.activityPending = false;
  };

  onSnapToItem = index => {
    this.guideIndex = index;
  };

  openMapDialog = () => {
    this.isMapsDialogVisible = true;
  };

  closeMapDialog = () => {
    this.isMapsDialogVisible = false;
  };
}

export default translate()(FindScreen);

import React, { Component } from 'react';
import { RefreshControl, View, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import UFOHeader from '../components/header/UFOHeader';
import UFOActionBar from '../components/UFOActionBar';
import { UFOContainer, UFOText } from '../components/common';
import appStore from '../stores/appStore';
import registerStore from '../stores/registerStore';
import { driveStore } from '../stores';
import { screens, actionStyles, icons } from '../utils/global';

@observer
class HomeScreen extends Component {
  @observable refreshing = false;

  render() {
    const { t, navigation } = this.props;

    const actions = [
      {
        style: driveStore.hasRentalConfirmedOrOngoing ? actionStyles.DONE : actionStyles.TODO,
        icon: icons.RESERVE,
        onPress: () => navigation.navigate(screens.RESERVE.name)
      },
      {
        style: registerStore.isUserRegistered ? actionStyles.DONE : actionStyles.TODO,
        icon: icons.REGISTER,
        onPress: () => navigation.navigate(screens.REGISTER.name)
      },
      {
        style: driveStore.hasRentalOngoing ? actionStyles.TODO : actionStyles.ACTIVE,
        icon: icons.DRIVE,
        onPress: () => navigation.navigate(screens.DRIVE.name)
      }
    ];

    return (
      <UFOContainer image={screens.HOME.backgroundImage}>
        <ScrollView refreshControl={this.refreshControl}>
          <UFOHeader
            transparent
            logo
            t={t}
            navigation={navigation}
            currentScreen={screens.HOME}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignContent: 'center'
            }}
          >
            <View style={{ paddingTop: '10%', paddingLeft: '10%', paddingRight: '10%' }}>
              <UFOText
                h2
                inverted
                center
                style={{ paddingTop: 10 }}
              >
                {t('home:reserve', { user: registerStore.user })}
              </UFOText>
              <UFOText
                h2
                inverted
                center
                style={{ paddingTop: 5 }}
              >
                {t('home:register', { user: registerStore.user })}
              </UFOText>
              <UFOText
                h2
                inverted
                center
                style={{ paddingTop: 5 }}
              >
                {t('home:drive', { user: registerStore.user })}
              </UFOText>
              <View style={{ height: 100 }} />
            </View>
          </View>
        </ScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }

  get refreshControl() {
    return (
      <RefreshControl
        refreshing={this.refreshing}
        onRefresh={this.refresh}
      />
    );
  }

  refresh = async () => {
    await appStore.initialise();
  };
}

export default translate()(HomeScreen);

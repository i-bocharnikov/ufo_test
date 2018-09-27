import React from "react";
import { ScrollView, RefreshControl, View } from 'react-native';
import { observer } from "mobx-react";
import { observable } from "mobx";
import { translate } from "react-i18next";

import UFOHeader from "../components/header/UFOHeader";
import UFOActionBar from "../components/UFOActionBar";
import { UFOContainer, UFOText, UFOTextInput } from '../components/common'
import appStore from '../stores/appStore'
import registerStore from "../stores/registerStore"
import driveStore from "../stores/driveStore"
import { screens, actionStyles, icons } from '../utils/global'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const video = require('../assets/UFOdrive.mp4')

@observer
class HomeScreen extends React.Component {

  @observable refreshing = false

  refresh = async () => {
    await appStore.initialise()
  }

  render() {
    const { t, navigation } = this.props;

    let actions = [
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
        style: driveStore.hasRentalOngoing ? actionStyles.TODO : driveStore.hasRentalConfirmed ? actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: icons.DRIVE,
        onPress: () => navigation.navigate(screens.DRIVE.name)
      }
    ]

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)


    return (
      <UFOContainer image={require("../assets/images/background/UFOBGHOME002.png")}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <UFOHeader transparent logo t={t} navigation={navigation} currentScreen={screens.HOME} />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ paddingTop: '10%', paddingLeft: '10%', paddingRight: '10%' }} >
              <UFOText h1 inverted center style={{ paddingTop: 10 }}>{t('home:welcome', { user: registerStore.user })}</UFOText>
              <UFOText h2 inverted center style={{ paddingTop: 10 }}>{t('home:reserve', { user: registerStore.user })}</UFOText>
              <UFOText h2 inverted center style={{ paddingTop: 5 }}>{t('home:register', { user: registerStore.user })}</UFOText>
              <UFOText h2 inverted center style={{ paddingTop: 5 }}>{t('home:drive', { user: registerStore.user })}</UFOText>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}

export default translate("translations")(HomeScreen);

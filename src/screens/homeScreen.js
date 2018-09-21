import React from "react";
import { Content } from 'native-base';
import Video from 'react-native-video';
import { ScrollView, RefreshControl } from 'react-native';
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
        style: driveStore.hasRentalConfirmedOrOngoing ? actionStyles.ACTIVE : actionStyles.TODO,
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
      <UFOContainer>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          {/*  <Video source={video}
          ref={(ref) => {
            this.player = ref
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
          resizeMode={"cover"}
          repeat={true}
          paused={false}
          muted={true}
        /> */}
          <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.HOME} />
          <Content padder>
            <UFOText>{t('home:welcome', { user: registerStore.user })}</UFOText>
          </Content>
          <UFOActionBar actions={actions} />
        </ScrollView>
      </UFOContainer >
    );
  }
}

export default translate("translations")(HomeScreen);

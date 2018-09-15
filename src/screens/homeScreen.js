import React from "react";
import { Container, Content, Text } from 'native-base';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { translate } from "react-i18next";

import registerStore from "../stores/registerStore"
import rentalStore from "../stores/rentalStore"
import ActionBarComponent from '../components/actionBar'
import { screens, actionStyles, icons } from '../utils/global'
import HeaderComponent from "../components/header";
const video = require('../assets/UFOdrive.mp4')

@observer
class HomeScreen extends React.Component {

  render() {
    const { t, navigation } = this.props;

    let actions = [
      {
        style: rentalStore.hasRentalConfirmedOrOngoing ? actionStyles.ACTIVE : actionStyles.TODO,
        icon: icons.RESERVE,
        onPress: () => navigation.navigate(screens.RESERVE.name)
      },
      {
        style: registerStore.isUserRegistered ? actionStyles.DONE : actionStyles.TODO,
        icon: icons.REGISTER,
        onPress: () => navigation.navigate(screens.REGISTER.name)
      },
      {
        style: rentalStore.hasRentalOngoing ? actionStyles.TODO : rentalStore.hasRentalConfirmed ? actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: icons.DRIVE,
        onPress: () => navigation.navigate(screens.DRIVE.name)
      }
    ]

    return (
      <Container>
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
        <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.HOME} />
        <Content padder>
          <Text>{t('home:welcome', { user: registerStore.user })}</Text>
          <Text>{rentalStore.hasRentalConfirmedOrOngoing}</Text>
        </Content>
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}

export default translate("translations")(HomeScreen);

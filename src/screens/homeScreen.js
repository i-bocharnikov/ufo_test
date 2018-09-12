import React from "react";
import { Container, Content, Text } from 'native-base';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { translate } from "react-i18next";

import registerStore from "../stores/registerStore"
import driveStore from "../stores/driveStore"
import ActionSupportComponent from '../components/actionSupport'
import ActionBarComponent from '../components/actionBar'
import { screens, actionStyles, icons } from '../utils/global'
import HeaderComponent from "../components/header";
const video = require('../assets/UFOdrive.mp4')

@observer
class HomeScreen extends React.Component {

  render() {
    const { t } = this.props;

    let actions = [
      {
        style: driveStore.hasRentalConfirmedOrOngoing ? actionStyles.ACTIVE : actionStyles.TODO,
        icon: icons.RESERVE,
        onPress: () => this.props.navigation.navigate(screens.RESERVE)
      },
      {
        style: registerStore.isUserRegistered ? actionStyles.DONE : actionStyles.TODO,
        icon: icons.REGISTER,
        onPress: () => this.props.navigation.navigate(screens.REGISTER)
      },
      {
        style: driveStore.hasRentalOngoing ? actionStyles.TODO : driveStore.hasRentalConfirmed ? actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: icons.DRIVE,
        onPress: () => this.props.navigation.navigate(screens.DRIVE)
      }
    ]

    return (
      <Container>
        <Video source={video}
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
        />
        <HeaderComponent t={t} transparent />
        <Content padder>
          <Text>{t('home:welcome', { user: registerStore.user })}</Text>
          <Text>{driveStore.hasRentalConfirmedOrOngoing}</Text>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.HOME })} />
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}

export default translate("translations")(HomeScreen);
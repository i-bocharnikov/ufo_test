import React from "react";
import { Container, Content, Text } from 'native-base';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { translate } from "react-i18next";

import UserStore from "../stores/usersStore"
import ActionSupportComponent from '../components/actionSupport'
import ActionBarComponent from '../components/actionBar'
import usersStore from "../stores/usersStore";
import { screens, styles, icons } from '../utils/global'
import HeaderComponent from "../components/header";
const video = require('../assets/UFOdrive.mp4')

@observer
class HomeScreen extends React.Component {

  async componentDidMount() {
    await UserStore.registerDevice()
  }

  render() {
    const { t } = this.props;

    let user = usersStore.user
    let actions = [
      {
        style: styles.TODO,
        icon: icons.RESERVE,
        onPress: () => this.props.navigation.navigate(screens.RESERVE)
      },
      {
        style: usersStore.isUserRegistered ? styles.DONE : styles.TODO,
        icon: icons.REGISTER,
        onPress: () => this.props.navigation.navigate(screens.REGISTER)
      },
      {
        style: styles.TODO,
        icon: icons.DRIVE,
        onPress: () => this.props.navigation.navigate(screens.DRIVE, { reference: "BLU001" })
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
        <HeaderComponent />
        <Content padder>
          <Text>{t('home:welcome', { user: user })}</Text>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.HOME })} />
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}

export default translate("translations")(HomeScreen);

import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { translate } from "react-i18next";
import UserStore from "../stores/usersStore"
import LogoComponent from "../components/logo"
import ActionBarComponent from '../components/actionBar'

const video = require('../assets/UFOdrive.mp4')


@observer
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoComponent />,
  };

  async componentDidMount() {
    await UserStore.registerDevice()
  }

  render() {
    const { t } = this.props;

    let actions = [
      {
        style: 'todo',
        icon: 'plus',
        text: 'Reserve',
        onPress: () => this.props.navigation.navigate('Reserve')
      },
      {
        style: 'todo',
        icon: 'account',
        text: 'Register',
        onPress: () => this.props.navigation.navigate('Register')
      },
      {
        style: 'todo',
        icon: 'steering',
        text: 'Drive',
        onPress: () => this.props.navigation.navigate('Drive', { reference: "BLU001" })
      }
    ]

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Video source={video}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
          style={styles.backgroundVideo}
          resizeMode={"cover"}
          repeat={true}
          paused={false}
          muted={true}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text> {t('home:welcome', { user: UserStore.user })}  </Text>
        </View>
        <ActionBarComponent actions={actions} />
      </View >
    );
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});


export default translate("translations")(HomeScreen);

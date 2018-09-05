import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { translate } from "react-i18next";
import UserStore from "../stores/usersStore"
import Logo from "../components/logo"


const video = require('../assets/UFOdrive.mp4')


@observer
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <Logo />,
  };

  async componentDidMount() {
    await UserStore.registerDevice()
  }

  render() {
    const { t } = this.props;
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
          <Button
            title="1 - Reserve"
            onPress={() => this.props.navigation.navigate('Reserve')}
          />
          <Button
            title="2 - Register"
            onPress={() => this.props.navigation.navigate('Register')}
          />
          <Button
            title="3 - Drive"
            onPress={() => this.props.navigation.navigate('Drive', { reference: "BLU001" })}
          />
        </View>
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

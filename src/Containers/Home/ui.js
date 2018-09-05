import React, { Component } from "react";
import { View, StyleSheet, Text, Button, Image } from 'react-native';
import Video from 'react-native-video';
import { observer } from "mobx-react";
import { observable } from "mobx";

import UserStore from "../../stores/usersStore"

const logo = require('../../assets/UFOLogo-alone-Horizontal.png')
const video = require('../../assets/UFOdrive.mp4')

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={logo}
        style={{ width: 200, height: 20 }}
      />
    );
  }
}


@observer
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  @observable boxVisible = true;
  toggleBox = () => {
    this.boxVisible = !this.boxVisible;
  };

  componentDidMount() {
    UserStore.registerDevice()
  }

  render() {
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
          <Text> Welcome  {UserStore.user ? UserStore.user.reference : "NA"} what is next? </Text>
          <Button onPress={this.toggleBox} title="Toggle Box"></Button>
          {this.boxVisible && <View style={styles.box} />}
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
  },
  box: {
    margin: 10,
    height: 200,
    width: 200,
    backgroundColor: "red"
  }
});


export default (HomeScreen);

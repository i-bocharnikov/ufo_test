import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import ActionBarComponent from '../components/actionBar'

class SupportScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Support ',
    };
  };

  render() {
    let actions = [
      {
        style: 'active',
        icon: 'home',
        text: 'Home',
        onPress: () => this.props.navigation.navigate('Home')
      },
    ]
    return (
      <View style={styles.container}>
        <ActionBarComponent actions={actions} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});



export default (SupportScreen);

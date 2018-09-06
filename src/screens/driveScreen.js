import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import ActionBarComponent from '../components/actionBar'

class DriveScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Rental ' + navigation.getParam('reference', 'NO-REFERENCE'),
    };
  };

  render() {
    let actions = [
      {
        style: 'done',
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



export default (DriveScreen);

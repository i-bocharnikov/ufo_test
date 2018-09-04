import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';


class ReservePaymentScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select the date and car',
    };
  };

  render() {
    return (
      <View style={styles.container}>
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



export default (ReservePaymentScreen);

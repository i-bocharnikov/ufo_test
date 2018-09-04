import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';


class ReserveLocationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select the product and location',
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



export default (ReserveLocationScreen);

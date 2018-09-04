import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';


class ReserveDateAndCarScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select the date and car',
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>List of Dates and cars</Text>
        <Button
          title="Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Next"
          onPress={() => this.props.navigation.navigate('Payment')}
        />
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
    justifyContent: "center"
  }
});



export default (ReserveDateAndCarScreen);

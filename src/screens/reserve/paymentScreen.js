import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';


class ReservePaymentScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Confirm',
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Payment input</Text>
        <Button
          title="Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Next"
          onPress={() => {
            this.props.navigation.popToTop()
            this.props.navigation.navigate('Home')
          }}
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
    justifyContent: "flex-start"
  }
});



export default (ReservePaymentScreen);

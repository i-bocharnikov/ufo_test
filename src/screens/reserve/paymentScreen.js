import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import ActionBarComponent from '../../components/actionBar'

class ReservePaymentScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Confirm',
    };
  };

  render() {
    let actions = [
      {
        style: 'active',
        icon: 'arrow-round-back',
        text: 'previous',
        onPress: () => this.props.navigation.pop()
      },
      {
        style: 'active',
        icon: 'home',
        text: 'Home',
        onPress: () => this.props.navigation.navigate('Home')
      },
      {

        style: 'todo',
        icon: 'card',
        text: 'Pay',
        onPress: () => { this.props.navigation.popToTop(); this.props.navigation.navigate('Home') }
      },
    ]
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



export default (ReservePaymentScreen);

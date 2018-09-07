import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import ActionBarComponent from '../../components/actionBar'


class ReserveDateAndCarScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select the date and car',
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
        icon: 'arrow-round-forward',
        text: 'Next',
        onPress: () => this.props.navigation.navigate('Payment')
      },
    ]
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
    justifyContent: "center"
  }
});



export default (ReserveDateAndCarScreen);

import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import ActionBarComponent from '../../components/actionBar'


class ReserveLocationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select the product and location',
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
      {
        style: 'todo',
        icon: 'menu-right',
        text: 'Next',
        onPress: () => this.props.navigation.navigate('DateAndCar')
      },
    ]
    return (
      <View style={styles.container}>
        <Text>List of product and location</Text>
        <Button
          title="Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Next"
          onPress={() => this.props.navigation.navigate('DatesAndCars')}
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



export default (ReserveLocationScreen);

import React from "react";
import { Button, View, Text, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import SupportScreen from './src/screens/SampleScreen'
import DriveScreen from './src/screens/DriveScreen'
import ReserveScreen from './src/screens/ReserveLocationScreen'
import RegisterScreen from './src/screens/CockpitScreen'


class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('./src/assets/UFOLogo-alone-Horizontal.png')}
        style={{ width: 200, height: 20 }}
      />
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Drive"
          onPress={() => this.props.navigation.navigate('Drive', { reference: "BLU001" })}
        />
        <Button
          title="Reserve"
          onPress={() => this.props.navigation.navigate('Reserve')}
        />
        <Button
          title="Register"
          onPress={() => this.props.navigation.navigate('Register')}
        />
        <Button
          title="Support"
          onPress={() => this.props.navigation.navigate('Support')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Drive: {
      screen: DriveScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Reserve: {
      screen: ReserveScreen
    },
    Support: {
      screen: SupportScreen
    }
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
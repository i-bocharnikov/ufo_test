import React from "react";
import { Button, View, StyleSheet, Image, Text } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import SupportScreen from './src/screens/SampleScreen'
import DriveScreen from './src/screens/DriveScreen'
import ReserveLocationScreen from './src/screens/ReserveLocationScreen'
import ReserveDateAndCarScreen from './src/screens/ReserveDateAndCarScreen'
import ReservePaymentScreen from './src/screens/ReservePaymentScreen'
import RegisterScreen from './src/screens/CockpitScreen'
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
const logo = require('./src/assets/UFOLogo-alone-Horizontal.png')
const video = require('./src/assets/UFOdrive.mp4')


//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={logo}
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
        <Video source={video}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
          }}                                      // Store reference
          style={styles.backgroundVideo}
          resizeMode={"cover"}
          //repeat={true}
          muted={true}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text> what is next?</Text>
          <Button
            title="1 - Reserve"
            onPress={() => this.props.navigation.navigate('Reserve')}
          />
          <Button
            title="2 - Register"
            onPress={() => this.props.navigation.navigate('Register')}
          />
          <Button
            title="3 - Drive"
            onPress={() => this.props.navigation.navigate('Drive', { reference: "BLU001" })}
          />
        </View>
      </View >
    );
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    }
  }
);

const ReserveStack = createStackNavigator(
  {
    ReserveLocationScreen: {
      screen: ReserveLocationScreen
    },
    ReserveDateAndCarScreen: {
      screen: ReserveDateAndCarScreen
    },
    ReservePaymentScreen: {
      screen: ReservePaymentScreen
    }
  }
);

const RegisterStack = createStackNavigator(
  {
    RegisterScreen: {
      screen: RegisterScreen
    }
  }
);

const SupportStack = createStackNavigator(
  {
    SupportScreen: {
      screen: SupportScreen
    }
  }
);

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Reserve: {
      screen: ReserveStack
    },
    Register: {
      screen: RegisterStack
    },
    Drive: {
      screen: DriveStack
    },
    Support: {
      screen: SupportStack
    }
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-planet${focused ? '' : '-outline'}`;
        } else if (routeName === 'Drive') {
          iconName = `ios-car${focused ? '' : '-outline'}`;
        } else if (routeName === 'Register') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        } else if (routeName === 'Reserve') {
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Support') {
          iconName = `ios-help-circle${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
      tabBarOptions: {
        activeTintColor: '#4ec6d6',
        inactiveTintColor: 'gray',
        activeBackgroundColor: '#172c32',
        inactiveBackgroundColor: '#172c32'

      },
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  })



export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
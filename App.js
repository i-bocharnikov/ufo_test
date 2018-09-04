import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from './src/Containers/Home/ui'
import SupportScreen from './src/Containers/SampleScreen'
import DriveScreen from './src/Containers/DriveScreen'
import ReserveLocationScreen from './src/Containers/Reserve/SelectLocation/ui'
import ReserveDateAndCarScreen from './src/Containers/Reserve/SelectDateAndCar/ui'
import ReservePaymentScreen from './src/Containers/Reserve/Payment/ui'
import RegisterScreen from './src/Containers/Register/ui'
import Ionicons from 'react-native-vector-icons/Ionicons';


//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  }
);

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  }
);

const ReserveStack = createStackNavigator(
  {
    Locations: {
      screen: ReserveLocationScreen
    },
    DatesAndCars: {
      screen: ReserveDateAndCarScreen
    },
    Payment: {
      screen: ReservePaymentScreen
    }
  }, {
    initialRouteName: 'Locations',
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  }
);

const RegisterStack = createStackNavigator(
  {
    RegisterScreen: {
      screen: RegisterScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  }

);

const SupportStack = createStackNavigator(
  {
    SupportScreen: {
      screen: SupportScreen
    }
  }, {
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#172c32',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
    )
  }
);

const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack
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

      }
    }
    )
  })



export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
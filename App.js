import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { View, StyleSheet, Text } from 'react-native';
import { Root } from "native-base";
import { StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { translate } from "react-i18next";
import { observer } from "mobx-react";

import DeveloperMenu from './src/components/developerMenu/ui'
import HomeScreen from './src/screens/homeScreen'
import SupportScreen from './src/screens/supportScreen'
import DriveScreen from './src/screens/driveScreen'
import ReserveLocationScreen from './src/screens/reserve/locationScreen'
import ReserveDateAndCarScreen from './src/screens/reserve/dateAndCarScreen'
import ReservePaymentScreen from './src/screens/reserve/paymentScreen'
import RegisterScreen from './src/screens/register/overview'
import activitiesStore from './src/stores/activitiesStore'
import ActivitiesComponent from "./src/components/activities"

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


const commonStackNavigationOptions =
{
  headerStyle: {
    backgroundColor: '#172c32',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerRight: (
    <ActivitiesComponent activities={activitiesStore.activities} />
  ),
};


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    }
  }, { navigationOptions: commonStackNavigationOptions }
);

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    }
  }, { navigationOptions: commonStackNavigationOptions }
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
    navigationOptions: commonStackNavigationOptions
  }
);


const RegisterStack = createStackNavigator(
  {
    RegisterScreen: {
      screen: RegisterScreen
    }
  }, { navigationOptions: commonStackNavigationOptions }
);

const SupportStack = createStackNavigator(
  {
    SupportScreen: {
      screen: SupportScreen
    }
  }, { navigationOptions: commonStackNavigationOptions }
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
      tabBarVisible: true, //TODO change to false to remove the tabbar
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
        inactiveBackgroundColor: '#172c32',
      }
    }
    )
  })


@observer
class App extends React.Component {

  render() {
    const { t } = this.props;
    return (
      <Root>
        <StatusBar translucent={false} backgroundColor='#172c32' barStyle='light-content' />
        {activitiesStore.internetAccessFailure && (
          <View style={styles.activities}><Text style={{ color: 'white' }}>{t('activities:internetAccessFailure')}</Text></View>
        )}
        {activitiesStore.bluetoothAccessFailure && (
          <View style={styles.activities}><Text style={{ color: 'white' }}>{t('activities:bluetoothAccessFailure')}</Text></View>
        )}
        <RootStack />
        {__DEV__ && <DeveloperMenu />}
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  activities: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});


export default translate("translations")(App);




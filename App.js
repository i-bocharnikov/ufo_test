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
import RegisterOverviewScreen from './src/screens/register/overview'
import RegisterEmailScreen from './src/screens/register/email'
import RegisterPhoneScreen from './src/screens/register/phone'
import activitiesStore from './src/stores/activitiesStore'
import ActivitiesComponent from "./src/components/activities"
import MessageComponent from "./src/components/message"
import { backgroundColor, textColor } from './src/utils/colors'

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


const commonStackNavigationOptions =
{
  headerStyle: {
    backgroundColor: backgroundColor.string(),
  },
  headerTintColor: textColor.string(),
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
    Location: {
      screen: ReserveLocationScreen
    },
    DateAndCar: {
      screen: ReserveDateAndCarScreen
    },
    Payment: {
      screen: ReservePaymentScreen
    }
  }, {
    initialRouteName: 'Location',
    navigationOptions: commonStackNavigationOptions
  }
);


const RegisterStack = createStackNavigator(
  {
    Overview: { screen: RegisterOverviewScreen },
    Phone: { screen: RegisterPhoneScreen },
    Email: { screen: RegisterEmailScreen }
  }, { initialRouteName: 'Overview', navigationOptions: commonStackNavigationOptions }
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
      tabBarVisible: false, //TODO change to false to remove the tabbar
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
    const activities = activitiesStore.activities
    return (
      <Root>
        <StatusBar translucent={false} backgroundColor='#172c32' barStyle='light-content' />
        <View style={styles.activities}>
          {activities.internetAccessFailure && (
            <MessageComponent text={t('activities:internetAccessFailure')} />
          )}
          {activities.bluetoothAccessFailure && (
            <MessageComponent text={t('activities:bluetoothAccessFailure')} />
          )}
        </View>
        <View style={{ flex: 1 }}><RootStack /></View>
        {__DEV__ && <DeveloperMenu />}
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  activities: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: "#172c32",
    justifyContent: "flex-start"
  }
});


export default translate("translations")(App);




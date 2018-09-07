import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Root } from "native-base";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { StyleProvider } from 'native-base';

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


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
import getTheme from './native-base-theme/components';
import './src/utils/global'
import { screens } from './src/utils/global'

const commonStackNavigationOptions = {};


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Support: {
      screen: SupportScreen
    }
  }, { headerMode: 'none', navigationOptions: commonStackNavigationOptions }
);

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    },
    Support: {
      screen: SupportScreen
    }
  }, { headerMode: 'none', navigationOptions: commonStackNavigationOptions }
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
    },
    Support: {
      screen: SupportScreen
    }
  }, {
    initialRouteName: screens.RESERVE_LOCATION,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);


const RegisterStack = createStackNavigator(
  {
    Overview: { screen: RegisterOverviewScreen },
    Phone: { screen: RegisterPhoneScreen },
    Email: { screen: RegisterEmailScreen },
    Support: {
      screen: SupportScreen
    }

  }, { initialRouteName: screens.REGISTER_OVERVIEW, headerMode: 'none', navigationOptions: commonStackNavigationOptions }
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
  },
  {
    initialRouteName: screens.HOME,
    navigationOptions: ({ navigation }) => ({ tabBarVisible: false }
    )
  })


@observer
class App extends React.Component {



  render() {
    const { t } = this.props;
    const activities = activitiesStore.activities
    return (
      <Root>
        <StyleProvider style={getTheme()}>
          <RootStack />
        </StyleProvider>
        {__DEV__ && <DeveloperMenu />}
      </Root >
    );
  }
}

export default translate("translations")(App);




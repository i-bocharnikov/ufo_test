import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Root, StyleProvider } from "native-base";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { StyleSheet, View, ActivityIndicator } from 'react-native';

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


import DeveloperMenu from './src/components/developerMenu'
import HomeScreen from './src/screens/homeScreen'
import SupportFaqsScreen from './src/screens/support/faqsScreen'
import SupportFaqScreen from './src/screens/support/faqScreen'
import SupportChatScreen from './src/screens/support/chatScreen'
import DriveScreen from './src/screens/drive/driveScreen'
import FindScreen from './src/screens/drive/findScreen'
import ReturnScreen from './src/screens/drive/returnScreen'
import InspectScreen from './src/screens/drive/inspectScreen'
import RentalAgreementScreen from './src/screens/drive/rentalAgreementSreen'
import ReserveLocationScreen from './src/screens/reserve/locationScreen'
import ReserveDateAndCarScreen from './src/screens/reserve/dateAndCarScreen'
import ReservePaymentScreen from './src/screens/reserve/paymentScreen'
import RegisterOverviewScreen from './src/screens/register/overview'
import RegisterEmailScreen from './src/screens/register/email'
import RegisterAddressScreen from './src/screens/register/address'
import RegisterPhoneScreen from './src/screens/register/phone'
import RegisterIdentificationScreen from './src/screens/register/identification'
import RegisterDriverLicenceScreen from './src/screens/register/driverLicence'

import getTheme from './native-base-theme/components';
import { screens, colors } from './src/utils/global'
import AppStore from './src/stores/appStore'


const commonStackNavigationOptions = {};


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },


  }, { headerMode: 'none', navigationOptions: commonStackNavigationOptions }
);

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    },
    Find: {
      screen: FindScreen
    },
    Return: {
      screen: ReturnScreen
    },
    Inspect: {
      screen: InspectScreen
    },
    RentalAgreement: {
      screen: RentalAgreementScreen
    },
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
  }, {
    initialRouteName: screens.RESERVE_LOCATION.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const SupportStack = createStackNavigator(
  {
    SupportFaqs: {
      screen: SupportFaqsScreen
    },
    SupportFaq: {
      screen: SupportFaqScreen
    },
    SupportChat: {
      screen: SupportChatScreen
    }
  }, {
    initialRouteName: screens.SUPPORT_FAQS.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const RegisterStack = createStackNavigator(
  {
    Overview: { screen: RegisterOverviewScreen },
    Phone: { screen: RegisterPhoneScreen },
    Email: { screen: RegisterEmailScreen },
    Address: { screen: RegisterAddressScreen },
    Identification: { screen: RegisterIdentificationScreen },
    DriverLicence: { screen: RegisterDriverLicenceScreen },


  }, { initialRouteName: screens.REGISTER_OVERVIEW.name, headerMode: 'none', navigationOptions: commonStackNavigationOptions }
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
    initialRouteName: screens.HOME.name,
    navigationOptions: ({ navigation }) => ({ tabBarVisible: false }
    )
  })


@observer
class App extends React.Component {

  async componentDidMount() {

    await AppStore.initialise(this.props.t)
  }

  render() {
    const { t } = this.props;

    if (!appStore.isAppReady) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.BACKGROUND.string() }}>
          <ActivityIndicator style={styles.centered} size="large" color={colors.ACTIVE} />
        </View>
      );
    }

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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default translate("translations")(App);




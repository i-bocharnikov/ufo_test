import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Root, StyleProvider } from "native-base";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { StyleSheet, View, ActivityIndicator, Platform, StatusBar, Alert } from 'react-native';

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


import UFOAdminMenu from './components/UFOAdminMenu'
import SupportFaqsScreen from './screens/support/faqsScreen'
import SupportFaqScreen from './screens/support/faqScreen'
import SupportChatScreen from './screens/support/chatScreen'
import DriveScreen from './screens/drive/driveScreen'
import FindScreen from './screens/guide/findScreen'
import ReturnScreen from './screens/guide/returnScreen'
import InspectScreen from './screens/inspect/inspectScreen'
import LocateDamage from './screens/inspect/locateDamage'
import CaptureDamage from './screens/inspect/captureDamage'
import CommentDamage from './screens/inspect/commentDamage'
import RentalAgreementScreen from './screens/term/rentalAgreementSreen'
import ReserveLocationScreen from './screens/reserve/locationScreen'
import ReserveDateAndCarScreen from './screens/reserve/dateAndCarScreen'
import ReservePaymentScreen from './screens/reserve/paymentScreen'
import RegisterOverviewScreen from './screens/register/overview'
import RegisterEmailScreen from './screens/register/email'
import RegisterAddressScreen from './screens/register/address'
import RegisterPhoneScreen from './screens/register/phone'
import RegisterIdentificationScreen from './screens/register/identification'
import RegisterDriverLicenceScreen from './screens/register/driverLicence'

import getTheme from '../native-base-theme/components';
import { screens, colors } from './utils/global'
import AppStore from './stores/appStore'



import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import registerStore from "./stores/registerStore";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        We have reported this to our team ! Please close the app and start again!
        `,
      [{
        text: 'Close'
      }]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString) => {
  console.log('setNativeExceptionHandler');
});

const commonStackNavigationOptions = {};

const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
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

const InspectStack = createStackNavigator(
  {
    Inspect: {
      screen: InspectScreen
    },
    InspectLocateDamage: {
      screen: LocateDamage
    },
    InspectCaptureDamage: {
      screen: CaptureDamage
    },
    InspectCommentDamage: {
      screen: CommentDamage
    },
  }, {
    initialRouteName: screens.INSPECT.name,
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
    Drive: {
      screen: DriveStack
    },
    Reserve: {
      screen: ReserveStack
    },
    Register: {
      screen: RegisterStack
    },
    Find: {
      screen: FindScreen
    },
    Return: {
      screen: ReturnScreen
    },
    Inspect: {
      screen: InspectStack
    },
    RentalAgreement: {
      screen: RentalAgreementScreen
    },
    Support: {
      screen: SupportStack
    }
  },
  {
    initialRouteName: screens.DRIVE.name,
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
        <View style={{ flex: 1, backgroundColor: colors.TRANSITION_BACKGROUND.string() }}>
          <ActivityIndicator style={styles.centered} size="large" color={colors.ACTIVE} />
        </View>
      );
    }

    return (
      <Root>
        <StatusBar
          backgroundColor='black'
          barStyle="light-content"
        />
        <StyleProvider style={getTheme()}>
          <RootStack />
        </StyleProvider>
        {registerStore.isAdmin && (
          <UFOAdminMenu />
        )}
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




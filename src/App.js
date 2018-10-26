import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  StatusBar,
  Alert,
  YellowBox
} from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import { Root, StyleProvider } from 'native-base';

import UFOAdminMenu from './components/UFOAdminMenu';
import { UFOContainer } from './components/common';
import SupportFaqsScreen from './screens/support/faqsScreen';
import SupportFaqScreen from './screens/support/faqScreen';
import SupportChatScreen from './screens/support/chatScreen';
import DriveScreen from './screens/drive/driveScreen';
import FindScreen from './screens/guide/findScreen';
import ReturnScreen from './screens/guide/returnScreen';
import InspectScreen from './screens/inspect/inspectScreen';
import LocateDamage from './screens/inspect/locateDamage';
import CaptureDamage from './screens/inspect/captureDamage';
import CommentDamage from './screens/inspect/commentDamage';
import RentalAgreementScreen from './screens/term/rentalAgreementSreen';
import ReserveLocationScreen from './screens/reserve/locationScreen';
import ReserveDateAndCarScreen from './screens/reserve/dateAndCarScreen';
import ReservePaymentScreen from './screens/reserve/paymentScreen';
import SignUpScreen from './screens/SignUp';
import RegisterPhoneScreen from './screens/SignUp/PhoneEditor';
import RegisterEmailScreen from './screens/SignUp/EmailEditor';
import RegisterAddressScreen from './screens/SignUp/AddressEditor';
import RegisterIdentificationScreen from './screens/SignUp/CardIdEditor';
import RegisterDriverLicenceScreen from './screens/SignUp/DriverCardEditor';
import AppStore from './stores/appStore';
import registerStore from './stores/registerStore';
import { screens, colors, backgrounds } from './utils/global';
import getTheme from './../native-base-theme/components';

/* Handling some errors */
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        We have reported this to our team! Please close the app and start again!
      `,
      [{
        text: 'Close'
      }]
    );
  } else {
    console.warn(e);
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString) => {
  console.log('setNativeExceptionHandler');
});

/* Describing navigators */
const commonStackNavigationOptions = {};
const DriveStack = createStackNavigator(
  {
    Drive: {
      screen: DriveScreen
    },
  },
  {
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
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
  },
  {
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
  },
  {
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
  },
  {
    initialRouteName: screens.SUPPORT_FAQS.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const RegisterStack = createStackNavigator(
  {
    SignUp: {
      screen: SignUpScreen
    },
    Phone: {
      screen: RegisterPhoneScreen
    },
    Email: {
      screen: RegisterEmailScreen
    },
    Address: {
      screen: RegisterAddressScreen
    },
    Identification: {
      screen: RegisterIdentificationScreen
    },
    DriverLicence: {
      screen: RegisterDriverLicenceScreen
    },
  },
  {
    initialRouteName: screens.REGISTER_OVERVIEW.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
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
    navigationOptions: ({ navigation }) => ({ tabBarVisible: false })
  });

/* Root App component */
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignSelf: 'center'
  },
  preloadWrapper: {
    flex: 1,
    backgroundColor: colors.TRANSITION_BACKGROUND.string()
  }
});

@observer
class App extends React.Component {
  async componentDidMount() {
    await AppStore.initialise(this.props.t);
  }

  render() {
    return !appStore.isAppReady ? (
      <View style={styles.preloadWrapper}>
          <UFOContainer image={backgrounds.HOME001}>
            <ActivityIndicator
              style={styles.centered}
              size='large'
              color={colors.ACTIVE}
            />
          </UFOContainer>
        </View>
    ) : (
      <Root>
        <StatusBar
          backgroundColor={colors.TRANSITION_BACKGROUND.string()}
          barStyle="light-content"
        />
        <StyleProvider style={getTheme()}>
          <RootStack />
        </StyleProvider>
        {registerStore.isAdmin && <UFOAdminMenu />}
      </Root>
    );
  }
}

export default translate('translations')(App);

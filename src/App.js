import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
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
import i18n from 'i18next';
import { StyleProvider } from 'native-base';

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
import SignUpScreen from './screens/SignUp';
import RegisterPhoneScreen from './screens/SignUp/PhoneEditor';
import RegisterEmailScreen from './screens/SignUp/EmailEditor';
import RegisterAddressScreen from './screens/SignUp/AddressEditor';
import RegisterIdentificationScreen from './screens/SignUp/CardIdEditor';
import RegisterDriverLicenceScreen from './screens/SignUp/DriverCardEditor';
import RegisterMilesScreen from './screens/SignUp/MilesEditor';
import BookingStackNavigator from './navigators/BookingStackNavigator';
import appStore from './stores/appStore';
import registerStore from './stores/registerStore';
import { screens, colors, backgrounds } from './utils/global';
import logger, { codeTypes, severityTypes } from './utils/userActionsLogger';
import getTheme from './../native-base-theme/components';

/* Handling some errors */
YellowBox.ignoreWarnings([
  'Module RNI18n requires main queue setup'
]);

const errorHandler = (error, isFatal) => {
  if (isFatal) {

    const message = i18n.t('error:jsExceptionFatal');
    logger(severityTypes.ERROR, codeTypes.ERROR, '', message, error);

    Alert.alert(
      message,
      `${
        i18n.t('error:jsExceptionFatalReport')
      }\n\n${
        i18n.t('error:error')
      }: ${
        error.name
      }\n${
        error.message
      }`,
      [ { text: i18n.t('common:closeBtn') } ]
    );
  } else {

    const message = i18n.t('error:jsException');
    logger(severityTypes.WARN, codeTypes.ERROR, '', message, error);
  }
};

// set true to second arg to use errorHandler in dev mode
setJSExceptionHandler(errorHandler);

setNativeExceptionHandler(exceptionStr => {
  const message = i18n.t('error:nativeException');
  logger(severityTypes.ERROR, codeTypes.ERROR, '', message, exceptionStr);
});

/* Describing navigators */
const commonStackNavigationOptions = {};
const DriveStack = createStackNavigator(
  { Drive: { screen: DriveScreen } },
  {
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const InspectStack = createStackNavigator(
  {
    Inspect: { screen: InspectScreen },
    InspectLocateDamage: { screen: LocateDamage },
    InspectCaptureDamage: { screen: CaptureDamage },
    InspectCommentDamage: { screen: CommentDamage }
  },
  {
    initialRouteName: screens.INSPECT.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const SupportStack = createStackNavigator(
  {
    SupportFaqs: { screen: SupportFaqsScreen },
    SupportFaq: { screen: SupportFaqScreen },
    SupportChat: { screen: SupportChatScreen }
  },
  {
    initialRouteName: screens.SUPPORT_FAQS.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const RegisterStack = createStackNavigator(
  {
    SignUp: { screen: SignUpScreen },
    Phone: { screen: RegisterPhoneScreen },
    Email: { screen: RegisterEmailScreen },
    Address: { screen: RegisterAddressScreen },
    Identification: { screen: RegisterIdentificationScreen },
    DriverLicence: { screen: RegisterDriverLicenceScreen },
    Miles: { screen: RegisterMilesScreen }
  },
  {
    initialRouteName: screens.REGISTER_OVERVIEW.name,
    headerMode: 'none',
    navigationOptions: commonStackNavigationOptions
  }
);

const RootStack = createBottomTabNavigator(
  {
    Drive: { screen: DriveStack },
    Reserve: { screen: BookingStackNavigator },
    Register: { screen: RegisterStack },
    Find: { screen: FindScreen },
    Return: { screen: ReturnScreen },
    Inspect: { screen: InspectStack },
    RentalAgreement: { screen: RentalAgreementScreen },
    Support: { screen: SupportStack }
  },
  {
    initialRouteName: screens.DRIVE.name,
    navigationOptions: () => ({ tabBarVisible: false })
  });

/* Root App component */
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignSelf: 'center'
  },
  appWrapper: {
    flex: 1,
    backgroundColor: colors.TRANSITION_BACKGROUND.string()
  }
});

@observer
class App extends React.Component {
  async componentDidMount() {
    await appStore.initialise(this.props.t);
  }

  render() {
    return !appStore.isAppReady ? (
      <SafeAreaView style={styles.appWrapper}>
        <UFOContainer image={backgrounds.HOME001}>
          <ActivityIndicator
            style={styles.centered}
            size="large"
            color={colors.ACTIVE}
          />
        </UFOContainer>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={styles.appWrapper}>
        <StatusBar
          backgroundColor={colors.TRANSITION_BACKGROUND.string()}
          barStyle="light-content"
        />
        <StyleProvider style={getTheme()}>
          <RootStack />
        </StyleProvider>
        {registerStore.isAdmin && <UFOAdminMenu />}
      </SafeAreaView>
    );
  }
}

export default translate('translations')(App);

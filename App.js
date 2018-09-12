import React from "react";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Root, StyleProvider } from "native-base";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { StyleSheet, View, ActivityIndicator } from 'react-native';

//Temporary ignore warning comming from react-native
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
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
import RegisterAddressScreen from './src/screens/register/address'
import RegisterPhoneScreen from './src/screens/register/phone'
import RegisterIdentificationScreen from './src/screens/register/identification'
import RegisterDriverLicenceScreen from './src/screens/register/driverLicence'
import { hydrate } from './src/utils/store'
import registerStore from "./src/stores/registerStore"
import driveStore from "./src/stores/driveStore"
import getTheme from './native-base-theme/components';
import './src/utils/global'
import { screens, colors } from './src/utils/global'

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
    Address: { screen: RegisterAddressScreen },
    Identification: { screen: RegisterIdentificationScreen },
    DriverLicence: { screen: RegisterDriverLicenceScreen },
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


  @observable isReady = false

  async componentDidMount() {

    let loadSuccess = true
    try {
      console.log("****************** LOAD SERVER DATA START *******************************")
      let registerLoad = await registerStore.registerDevice()
      let driveLoad = await driveStore.list()
      console.log("****************** LOAD SERVER DATA DONE *******************************")
      loadSuccess = registerLoad && driveLoad
      if (!loadSuccess) {
        console.log("****************** LOAD SERVER DATA FAILED *******************************")
      }
    } catch (error) {
      console.log("****************** LOAD SERVER DATA FAILED *******************************", error)
      loadSuccess = false
    }

    if (!loadSuccess) {
      console.log("****************** LOAD LOCAL DATA START *******************************")
      try {
        hydrate('register', registerStore).then(() => console.log('registerStore hydrated'))
        hydrate('drive', driveStore).then(() => console.log('driveStore hydrated'))
      } catch (error) {
        console.log("****************** LOAD LOCAL DATA FAILED *******************************", error)
      }
      console.log("****************** LOAD LOCAL DATA DONE *******************************")
    }
    this.isReady = true
  }

  render() {
    const { t } = this.props;

    if (!this.isReady) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.BACKGROUND.string() }}>
          <ActivityIndicator style={styles.centered} />
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




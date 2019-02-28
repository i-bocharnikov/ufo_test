import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';

const routeConfigs = {
  [keys.SignUp]: { screen: screens.SignUp },
  [keys.Phone]: { screen: screens.PhoneEditor },
  [keys.Email]: { screen: screens.EmailEditor },
  [keys.Address]: { screen: screens.AddressEditor },
  [keys.Identification]: { screen: screens.CardIdEditor },
  [keys.DriverLicence]: { screen: screens.DriverCardEditor },
  [keys.Miles]: { screen: screens.MilesEditor }
};

const navigatorConfig = {
  initialRouteName: keys.SignUp,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

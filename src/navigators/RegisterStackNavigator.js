import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import SignUp from './../screens/SignUp';
import PhoneEditor from './../screens/SignUp/PhoneEditor';
import EmailEditor from './../screens/SignUp/EmailEditor';
import AddressEditor from './../screens/SignUp/AddressEditor';
import CardIdEditor from './../screens/SignUp/CardIdEditor';
import DriverCardEditor from './../screens/SignUp/DriverCardEditor';
import MilesEditor from './../screens/SignUp/MilesEditor';

const routeConfigs = {
  [keys.SignUp]: { screen: SignUp },

  [keys.Phone]: { screen: PhoneEditor },
  [keys.Email]: { screen: EmailEditor },
  [keys.Address]: { screen: AddressEditor },
  [keys.Identification]: { screen: CardIdEditor },
  [keys.DriverLicence]: { screen: DriverCardEditor },
  [keys.Miles]: { screen: MilesEditor }
};

const navigatorConfig = {
  initialRouteName: keys.SignUp,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

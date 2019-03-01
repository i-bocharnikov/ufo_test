import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import SignUp from './../screens/SignUp';
import PhoneEditor from './../screens/SignUp/PhoneEditor';
import AddressEditor from './../screens/SignUp/AddressEditor';
import CardIdEditor from './../screens/SignUp/CardIdEditor';
import DriverCardEditor from './../screens/SignUp/DriverCardEditor';

const routeConfigs = {
  [keys.SignUp]: { screen: SignUp },
  [keys.Phone]: { screen: PhoneEditor },
  [keys.Address]: { screen: AddressEditor },
  [keys.Identification]: { screen: CardIdEditor },
  [keys.DriverLicence]: { screen: DriverCardEditor }
};

const navigatorConfig = {
  initialRouteName: keys.SignUp,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

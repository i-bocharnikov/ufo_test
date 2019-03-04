import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import SignUp from './../screens/SignUp';
import ContactsEditor from './../screens/SignUp/ContactsEditor';
import AddressEditor from './../screens/SignUp/AddressEditor';
import CardIdEditor from './../screens/SignUp/CardIdEditor';
import DriverCardEditor from './../screens/SignUp/DriverCardEditor';

const routeConfigs = {
  [keys.SignUp]: { screen: SignUp },
  [keys.Contacts]: { screen: ContactsEditor },
  [keys.Address]: { screen: AddressEditor },
  [keys.Identification]: { screen: CardIdEditor },
  [keys.DriverLicence]: { screen: DriverCardEditor }
};

const navigatorConfig = {
  initialRouteName: keys.SignUp,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

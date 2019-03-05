import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import SignUp from './../screens/SignUp';
import ContactsInfoEditor from './../screens/SignUp/ContactsInfoEditor';
import BillingInfoEditor from './../screens/SignUp/BillingInfoEditor';
import IdCardEditor from './../screens/SignUp/IdCardEditor';
import DriverCardEditor from './../screens/SignUp/DriverCardEditor';

const routeConfigs = {
  [keys.SignUp]: { screen: SignUp },
  [keys.ContactsInfoEditor]: { screen: ContactsInfoEditor },
  [keys.BillingInfoEditor]: { screen: BillingInfoEditor },
  [keys.IdCardEditor]: { screen: IdCardEditor },
  [keys.DriverCardEditor]: { screen: DriverCardEditor }
};

const navigatorConfig = {
  initialRouteName: keys.SignUp,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

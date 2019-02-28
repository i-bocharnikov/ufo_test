import { createStackNavigator } from 'react-navigation';

import keys from './helpers/screenKeys';
import Inspect from './../screens/inspect/inspectScreen';
import LocateDamage from './../screens/inspect/locateDamage';
import CaptureDamage from './../screens/inspect/captureDamage';
import CommentDamage from './../screens/inspect/commentDamage';

const routeConfigs = {
  [keys.Inspect]: { screen: Inspect },
  [keys.InspectLocateDamage]: { screen: LocateDamage },
  [keys.InspectCaptureDamage]: { screen: CaptureDamage },
  [keys.InspectCommentDamage]: { screen: CommentDamage }
};

const navigatorConfig = {
  initialRouteName: keys.Inspect,
  headerMode: 'none'
};

export default createStackNavigator(routeConfigs, navigatorConfig);

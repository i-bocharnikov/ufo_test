import createBottomTabNavigator from './utils/createAnimatedBottomTabNavigator';
import keys from './helpers/screenKeys';
import BookingStackNavigator from './BookingStackNavigator';
import InspectStackNavigator from './InspectStackNavigator';
import SupportStackNavigator from './SupportStackNavigator';
import RegisterStackNavigator from './RegisterStackNavigator';
import Drive from './../screens/drive/driveScreen';
import Find from './../screens/guide/findScreen';
import Return from './../screens/guide/returnScreen';
import RentalAgreement from './../screens/term/rentalAgreementSreen';
import FaceRecognizer from './../screens/FaceRecognizer';

export default createBottomTabNavigator({
  [keys.Register]: RegisterStackNavigator,
  [keys.Drive]: { screen: Drive },
  [keys.Booking]: BookingStackNavigator,
  [keys.Inspect]: InspectStackNavigator,
  [keys.Support]: SupportStackNavigator,
  [keys.Find]: { screen: Find },
  [keys.Return]: { screen: Return },
  [keys.RentalAgreement]: { screen: RentalAgreement },
  [keys.FaceRecognizer]: { screen: FaceRecognizer }
},
{
  initialRouteName: keys.Home,
  defaultNavigationOptions: () => ({ tabBarVisible: false })
});

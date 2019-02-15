import AppStore from './AppStore';
import DriveStore from './DriveStore';
import BookingStore from './BookingStore';
import RegisterStore from './RegisterStore';
import InspectStore from './InspectStore';
import GuideStore from './GuideStore';
import TermStore from './TermStore';
import FeedbackStore from './FeedbackStore';
import ActivitiesStore from './ActivitiesStore';
import OTAKeyStore from './OTAKeyStore';
import SupportStore from './SupportStore';

const appStore = new AppStore();
const registerStore = new RegisterStore();
const driveStore = new DriveStore();
const inspectStore = new InspectStore();
const guideStore = new GuideStore();
const termStore = new TermStore();
const bookingStore = new BookingStore();
const feedbackStore = new FeedbackStore();
const activitiesStore = new ActivitiesStore();
const supportStore = new SupportStore();
const otaKeyStore = new OTAKeyStore();

export {
  appStore,
  registerStore,
  driveStore,
  inspectStore,
  guideStore,
  termStore,
  bookingStore,
  feedbackStore,
  activitiesStore,
  supportStore,
  otaKeyStore
};

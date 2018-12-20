import DriveStore from './driveStore';
import InspectStore from './inspectStore';
import GuideStore from './guideStore';
import TermStore from './termStore';
import BookingStore from './bookingStore';
import FeedbackStore from './feedbackStore';
import RegisterStore from './registerStore';

export const registerStore = RegisterStore;
export const driveStore = new DriveStore();
export const inspectStore = new InspectStore();
export const guideStore = new GuideStore();
export const termStore = new TermStore();
export const bookingStore = new BookingStore();
export const feedbackStore = new FeedbackStore();

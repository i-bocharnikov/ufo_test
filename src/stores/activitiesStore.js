import { observable, computed, action } from 'mobx';
import userActionsLogger, {
  codeTypes,
  severityTypes
} from '../utils/userActionsLogger';

class Activities {
  @observable internetAccessPendingRequests = 0;
  @observable bluetoothAccessPendingRequests = 0;

  @action
  registerInternetStart = () => {
    this.internetAccessPendingRequests++;
  };
  @action
  registerInternetStopSuccess = () => {
    if (this.internetAccessFailure === true) {
      userActionsLogger(
        severityTypes.WARN,
        codeTypes.SUCCESS,
        'onInternetConnectionChanged',
        `Internet connection back to success`
      );
    }
    this.internetAccessPendingRequests--;
    this.internetAccessFailure = false;
  };

  @action
  registerInternetStopFailure = () => {
    if (this.internetAccessFailure === false) {
      userActionsLogger(
        severityTypes.WARN,
        codeTypes.ERROR,
        'onInternetConnectionChanged',
        `Internet connection failure`
      );
    }
    this.internetAccessPendingRequests--;
    this.internetAccessFailure = true;
  };

  @action
  registerBluethoothStart = () => {
    this.bluethoothAccessPendingRequests++;
  };
  @action
  registerBluethoothStopSuccess = () => {
    this.bluethoothAccessPendingRequests--;
    this.bluetoothAccessFailure = false;
  };
  @action
  registerBluethoothStopFailure = () => {
    this.bluethoothAccessPendingRequests--;
    this.bluetoothAccessFailure = true;
  };

  @computed get internetAccessPending() {
    return this.internetAccessPendingRequests > 0;
  }
  @observable internetAccessFailure = false;

  @computed get bluethoothAccessPending() {
    return this.bluethoothAccessPendingRequests > 0;
  }
  @observable bluetoothAccessFailure = false;
}

class ActivitiesStore {
  @observable activities = new Activities();
}

const activitiesStore = new ActivitiesStore();
export default activitiesStore;

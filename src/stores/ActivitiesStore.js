import { observable, computed, action } from 'mobx';
import remoteLoggerService from './../utils/remoteLoggerService';

class Activities {
  @observable internetAccessPendingRequests = 0;
  @observable bluetoothAccessPendingRequests = 0;
  @observable internetAccessFailure = false;
  @observable bluetoothAccessFailure = false;

  @action
  registerInternetStart = () => {
    this.internetAccessPendingRequests++;
  };

  @action
  registerInternetStopSuccess = async () => {
    if (this.internetAccessFailure === true) {
      await remoteLoggerService.info(
        'internetConnectionChanged',
        'Internet connection back to success'
      );
    }
    this.internetAccessPendingRequests--;
    this.internetAccessFailure = false;
  };

  @action
  registerInternetStopFailure = async () => {
    if (this.internetAccessFailure === false) {
      await remoteLoggerService.warn(
        'internetConnectionChanged',
        'Internet connection failure'
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

  @computed get bluethoothAccessPending() {
    return this.bluethoothAccessPendingRequests > 0;
  }
}

export default class ActivitiesStore {
  @observable activities = new Activities();
}

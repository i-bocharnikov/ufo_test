import { observable, computed, action } from 'mobx';

class Activities {
  @observable internetAccessPendingRequests = 0;
  @observable bluetoothAccessPendingRequests = 0;

  @action
  registerInternetStart = () => {
    this.internetAccessPendingRequests++;
  };
  @action
  registerInternetStopSuccess = () => {
    this.internetAccessPendingRequests--;
    this.internetAccessFailure = false;
  };

  @action
  registerInternetStopFailure = () => {
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

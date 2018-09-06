import { observable } from 'mobx';

class Activities {
    @observable internetAccessPending = false
    @observable internetAccessFailure = false

    @observable bluetoothAccessPending = false
    @observable bluetoothAccessFailure = false
}

class ActivitiesStore {
    @observable activities = new Activities()
}

export default activitiesStore = new ActivitiesStore();

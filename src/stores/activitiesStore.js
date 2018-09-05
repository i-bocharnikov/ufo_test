import { observable } from 'mobx';


class ActivitiesStore {

    @observable internetAccessPending = false
    @observable internetAccessFailure = false

    @observable bluetoothAccessPending = false
    @observable bluetoothAccessFailure = false
}

export default activitiesStore = new ActivitiesStore();

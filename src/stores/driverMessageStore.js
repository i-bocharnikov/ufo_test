import { observable } from 'mobx';


class DriverMessageStore {

    @observable internetAccessPending = false
    @observable internetAccessFailure = false
}

export default driverMessageStore = new DriverMessageStore();

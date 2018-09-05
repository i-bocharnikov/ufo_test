import { observable } from 'mobx';

class AppInfoStore {

    @observable apiConnectionPending = false
    @observable apiConnectionFailed = false

    @observable bluetoothConnectionPending = false
    @observable bluetoothConnectionFailed = false

}

export default appInfoStore = new AppInfoStore();

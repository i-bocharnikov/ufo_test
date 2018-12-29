import { observable, action } from 'mobx';

import supportStore from '../stores/supportStore';
import registerStore from '../stores/registerStore';
import { driveStore } from '../stores';
import OTAKeyStore from '../stores/otaKeyStore';
import { checkConnectivity } from '../utils/api_deprecated';
import { hydrate } from '../utils/store';
import { confirm } from '../utils/interaction';
import otaKeyStore from '../stores/otaKeyStore';

class AppStore {
  @observable isAppReady: boolean = false;

  @action
  async register(t): Promise<boolean> {
    try {
      console.log('==> REGISTER START ');
      console.log('- GET OTA DEVICE IDENTIFICATION ');
      let keyAccessDeviceIdentifier = await OTAKeyStore.getKeyAccessDeviceIdentifier();
      console.log('- OPEN SESSION ON SERVER ');
      let keyAccessDeviceToken = await registerStore.registerDevice(keyAccessDeviceIdentifier);
      if (keyAccessDeviceToken) {
        console.log('- OPEN SESSION IN OTA ');
        await OTAKeyStore.openSession(keyAccessDeviceToken);
      } else {
        keyAccessDeviceIdentifier = await OTAKeyStore.getKeyAccessDeviceIdentifier(true);
        console.log('- OPEN SESSION ON SERVER ');
        let keyAccessDeviceToken = await registerStore.registerDevice(keyAccessDeviceIdentifier);
        if (keyAccessDeviceToken) {
          console.log('- OPEN SESSION IN OTA');
          await OTAKeyStore.openSession(keyAccessDeviceToken);
        }
      }
      console.log('<== REGISTER DONE ');
    } catch (error) {
      console.log('<== REGISTER FAILED ', error);
      return false;
    }
    return true;
  }

  @action
  async loadRemoteData(t): Promise<boolean> {
    try {
      console.log('==>  LOAD REMOTE DATA START ');
      await driveStore.reset();
      await supportStore.reset();
      console.log('<== LOAD REMOTE DATA DONE ');
    } catch (error) {
      console.log('<== LOAD REMOTE DATA FAILED ', error);
      return false;
    }
    return true;
  }

  @action
  async loadLocalData(t) {
    console.log('==>  LOAD LOCAL DATA START ');

    try {
      await hydrate('register', registerStore).then(() => console.log('registerStore hydrated'));
      await hydrate('drive', driveStore).then(() => console.log('driveStore hydrated'));
      await hydrate('support', supportStore).then(() => console.log('supportStore hydrated'));
      console.log('<== LOAD LOCAL DATA DONE ');
    } catch (error) {
      console.log('<== LOAD LOCAL DATA FAILED ', error);
    }
  }

  @action
  async initialise(t) {
    console.log('==>  INITIALISE APPLICATION ');
    this.isAppReady = false;
    let result =
      (await checkConnectivity()) && (await this.register(t)) && (await this.loadRemoteData(t));
    if (!result) {
      console.log('<== FALLBACK ');
      await this.loadLocalData(t);
    }
    this.isAppReady = true;
    console.log('<== INITIALISE DONE ');
  }

  @action
  async connect(t, code): Promise<boolean> {
    if (await checkConnectivity()) {
      if (
        !(await registerStore.connect(
          t,
          code
        ))
      ) {
        return false;
      }
      (await this.register(t)) && (await this.loadRemoteData(t));
      return true;
    }
    return false;
  }

  @action
  async disconnect(t): Promise<boolean> {
    confirm(
      t('global:confirmationTitle'),
      t('register:disconnectConfirmationMessage'),
      async () => {
        if (await checkConnectivity()) {
          registerStore.disconnect(t);
          await this.initialise(t);
        }
      }
    );
  }
}

export default (appStore = new AppStore());

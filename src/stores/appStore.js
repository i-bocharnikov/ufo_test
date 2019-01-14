import { observable, action } from 'mobx';

import supportStore from '../stores/supportStore';
import registerStore from '../stores/registerStore';
import { driveStore } from '../stores';
import OTAKeyStore from '../stores/otaKeyStore';
import { checkConnectivity } from '../utils/api_deprecated';
import { hydrate } from '../utils/store';
import { confirm } from '../utils/interaction';
import logger, { codeTypes, severityTypes } from '../utils/userActionsLogger';
import otaKeyStore from '../stores/otaKeyStore';

class AppStore {
  @observable isAppReady: boolean = false;

  @action
  async register(): Promise<boolean> {
    try {
      console.log('==> REGISTER START ');
      console.log('- GET OTA DEVICE IDENTIFICATION ');
      let keyAccessDeviceIdentifier = await OTAKeyStore.getKeyAccessDeviceIdentifier();
      console.log('- OPEN SESSION ON SERVER ');
      let keyAccessDeviceToken = await registerStore.registerDevice(
        keyAccessDeviceIdentifier
      );
      if (keyAccessDeviceToken) {
        console.log('- OPEN SESSION IN OTA ');
        await OTAKeyStore.openSession(keyAccessDeviceToken);
      } else {
        keyAccessDeviceIdentifier = await OTAKeyStore.getKeyAccessDeviceIdentifier(
          true
        );
        console.log('- OPEN SESSION ON SERVER ');
        let keyAccessDeviceToken = await registerStore.registerDevice(
          keyAccessDeviceIdentifier
        );
        if (keyAccessDeviceToken) {
          console.log('- OPEN SESSION IN OTA');
          await OTAKeyStore.openSession(keyAccessDeviceToken);
        }
      }
      console.log('<== REGISTER DONE ');
    } catch (error) {
      console.log('<== REGISTER FAILED ', error);
      logger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'register',
        'exception',
        error
      );
      return false;
    }
    return true;
  }

  @action
  async loadRemoteData(): Promise<boolean> {
    try {
      console.log('==>  LOAD REMOTE DATA START ');
      await driveStore.reset();
      await supportStore.reset();
      console.log('<== LOAD REMOTE DATA DONE ');
    } catch (error) {
      logger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'initialiseRemoteDate',
        `Global exception: ${error.message}`,
        JSON.stringify(error)
      );
      return false;
    }
    return true;
  }

  @action
  async initialiseLocalStore() {
    console.log('==>  INIT LOCAL STORE START ');

    try {
      await hydrate('registerStore', registerStore)
        .then(() =>
          logger(
            severityTypes.INFO,
            codeTypes.SUCCESS,
            'initialiseLocalStore',
            `registerStore loaded`,
            JSON.stringify(registerStore.user)
          )
        )
        .catch(error => {
          logger(
            severityTypes.ERROR,
            codeTypes.ERROR,
            'initialiseLocalStore',
            `registerStore exception: ${error.message}`,
            JSON.stringify(error)
          );
        });

      await hydrate('driveStore', driveStore)
        .then(() =>
          logger(
            severityTypes.INFO,
            codeTypes.SUCCESS,
            'initialiseLocalStore',
            `driveStore loaded`,
            driveStore.rentals ? driveStore.rentals.length : 0 + ' rentals'
          )
        )
        .catch(error => {
          logger(
            severityTypes.ERROR,
            codeTypes.ERROR,
            'initialiseLocalStore',
            `driveStore exception: ${error.message}`,
            JSON.stringify(error)
          );
        });

      await hydrate('supportStore', supportStore)
        .then(() =>
          logger(
            severityTypes.INFO,
            codeTypes.SUCCESS,
            'initialiseLocalStore',
            `supportStore loaded`,
            supportStore.faqCategories
              ? supportStore.faqCategories.length
              : 0 + ' faqCategories'
          )
        )
        .catch(error => {
          logger(
            severityTypes.ERROR,
            codeTypes.ERROR,
            'initialiseLocalStore',
            `supportStore exception: ${error.message}`,
            JSON.stringify(error)
          );
        });

      await hydrate('otaKeyStore', otaKeyStore)
        .then(() =>
          logger(
            severityTypes.INFO,
            codeTypes.SUCCESS,
            'initialiseLocalStore',
            `otaKeyStore loaded`,
            JSON.stringify(otaKeyStore.key)
          )
        )
        .catch(error => {
          logger(
            severityTypes.ERROR,
            codeTypes.ERROR,
            'initialiseLocalStore',
            `otaKeyStore exception: ${error.message}`,
            JSON.stringify(error)
          );
        });
    } catch (error) {
      logger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'initialiseLocalStore',
        'Global exception',
        JSON.stringify(error)
      );
      console.log('<== INIT Local STORE FAILED ', error);
      return false;
    }

    console.log('<==  INIT LOCAL STORE DONE ');
    return true;
  }

  @action
  async initialise() {
    console.log('==>  INITIALISE APPLICATION ');
    this.isAppReady = false;
    await this.initialiseLocalStore();
    if (await checkConnectivity()) {
      if (await this.register()) {
        await this.loadRemoteData();
      }
    }
    /*if (otaKeyStore.key && otaKeyStore.key.keyId) {
      logger(
        severityTypes.INFO,
        codeTypes.SUCCESS,
        'initialise',
        `re enableKey and switch last key ${otaKeyStore.key.keyId}`,
        JSON.stringify(otaKeyStore.key)
      );
      await otaKeyStore.enableKey(otaKeyStore.key.keyId, false);
      await otaKeyStore.switchToKey(otaKeyStore.key.keyId, false);
    }*/
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
      (await this.register()) && (await this.loadRemoteData());
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
          await this.initialise();
        }
      }
    );
  }
}

const appStore = new AppStore();
export default appStore;

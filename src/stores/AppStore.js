import { observable, action } from 'mobx';
import i18n from 'i18next';

import {
  driveStore,
  otaKeyStore,
  registerStore,
  supportStore
} from './../stores';
import { checkConnectivity } from './../utils/api_deprecated';
import { hydrate } from './../utils/store';
import { confirm } from './../utils/interaction';
import remoteLoggerService from './../utils/remoteLoggerService';
import { showAlertInfo } from './../utils/interaction';

export default class AppStore {
  @observable isAppReady = false;
  keyAccessDeviceToken = null;

  @action
  async register() {
    try {
      let keyAccessDeviceIdentifier = await otaKeyStore.getKeyAccessDeviceIdentifier();
      this.keyAccessDeviceToken = await registerStore.registerDevice(
        keyAccessDeviceIdentifier
      );

      if (this.keyAccessDeviceToken) {
        await remoteLoggerService.info(
          'register',
          'registration success including keyAccessDeviceToken',
          registerStore.user
        );
        await otaKeyStore.openSession(this.keyAccessDeviceToken);
      } else {
        await remoteLoggerService.warn(
          'register',
          'registration done but without keyAccessDeviceToken so we force creating new one',
          registerStore.user
        );
        keyAccessDeviceIdentifier = await otaKeyStore.getKeyAccessDeviceIdentifier(
          true
        );
        this.keyAccessDeviceToken = await registerStore.registerDevice(
          keyAccessDeviceIdentifier
        );

        if (this.keyAccessDeviceToken) {
          await remoteLoggerService.info(
            'register',
            'registration success with new keyAccessDeviceToken',
            registerStore.user
          );
          await otaKeyStore.openSession(this.keyAccessDeviceToken);
        } else {
          await remoteLoggerService.fatal(
            'register',
            "registration success but doesn't include keyAccessDeviceToken for the second time after forcing new temp token. give up",
            registerStore.user
          );
        }
      }
    } catch (error) {
      await remoteLoggerService.fatal(
        'register',
        `exception: ${error.message}`,
        error,
        registerStore.user
      );
      return false;
    }
    return true;
  }

  @action
  async loadRemoteData() {
    try {
      await remoteLoggerService.initialise();
      await driveStore.reset();
      await supportStore.fetchGuides();
    } catch (error) {
      await remoteLoggerService.error(
        'initialiseRemoteDate',
        `Global exception: ${error.message}`,
        error,
        registerStore.user
      );
      return false;
    }
    return true;
  }

  @action
  async initialiseLocalStore() {
    try {
      await hydrate('registerStore', registerStore)
        .then(() =>
          remoteLoggerService.info(
            'initialiseLocalStore',
            'registerStore loaded',
            registerStore.user
          )
        )
        .catch(error => {
          remoteLoggerService.error(
            'initialiseLocalStore',
            `registerStore exception: ${error.message}`,
            error
          );
        });

      await hydrate('driveStore', driveStore)
        .then(() =>
          remoteLoggerService.info(
            'initialiseLocalStore',
            'driveStore loaded',
            driveStore.rentals ? driveStore.rentals.length : 0 + ' rentals'
          )
        )
        .catch(error => {
          remoteLoggerService.error(
            'initialiseLocalStore',
            `driveStore exception: ${error.message}`,
            error
          );
        });

      await hydrate('supportStore', supportStore)
        .then(() =>
          remoteLoggerService.info(
            'initialiseLocalStore',
            'supportStore loaded',
            supportStore.guideCategories
              ? supportStore.guideCategories.length
              : 0 + ' guideCategories'
          )
        )
        .catch(error => {
          remoteLoggerService.error(
            'initialiseLocalStore',
            `supportStore exception: ${error.message}`,
            error
          );
        });

      await hydrate('otaKeyStore', otaKeyStore)
        .then(() =>
          remoteLoggerService.info(
            'initialiseLocalStore',
            'otaKeyStore loaded',
            otaKeyStore.key
          )
        )
        .catch(error => {
          remoteLoggerService.error(
            'initialiseLocalStore',
            `otaKeyStore exception: ${error.message}`,
            error
          );
        });
    } catch (error) {
      remoteLoggerService.error(
        'initialiseLocalStore',
        `Global exception: ${error.message}`,
        error
      );
      return false;
    }
    return true;
  }

  @action
  async initialise() {
    this.isAppReady = false;
    await this.initialiseLocalStore();
    const canBeConnected = await checkConnectivity();

    if (canBeConnected) {
      const isRegistered = await this.register();

      if (isRegistered) {
        await this.loadRemoteData();
      }

      await this.showStartUpMessage();
    } else {
      await remoteLoggerService.info(
        'initialise',
        'Without connectivity, we reuse existing token (used if connectivity is back) and register OTAlisterners',
        registerStore.user
      );
      await registerStore.reuseToken();
      await otaKeyStore.addListeners();
    }

    this.isAppReady = true;
  }

  @action
  async connect(code) {
    if (await checkConnectivity()) {
      if (!(await registerStore.connect(code))) {
        return false;
      }

      (await this.register()) && (await this.loadRemoteData());
      return true;
    }

    return false;
  }

  @action
  async disconnect() {
    confirm(
      i18n.t('global:confirmationTitle'),
      i18n.t('register:disconnectConfirmationMessage'),
      async () => {
        if ( await checkConnectivity() ) {
          registerStore.disconnect();
          otaKeyStore.closeSession();
          await this.initialise();
          await remoteLoggerService.info(
            'disconnect',
            'success',
            registerStore.user
          );
        }
      }
    );
  }

  async showStartUpMessage() {
    if (registerStore.startupMessage) {
      await showAlertInfo(null, registerStore.startupMessage);
    }
  }
}

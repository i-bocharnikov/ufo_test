import { Platform } from 'react-native';
import Permissions from 'react-native-permissions';
import i18n from 'i18next';

import { showAlertInfo } from './interaction';
import remoteLoggerService from './remoteLoggerService';

const IS_IOS = Platform.OS === 'ios';

export async function checkAndRequestLocationPermission() {
  return await checkAndRequestPermission('location');
}

export async function checkAndRequestBluetoothPermission() {
  return await checkAndRequestPermission('bluetooth');
}

export async function checkAndRequestCameraPermission() {
  return await checkAndRequestPermission('camera');
}

async function checkAndRequestPermission(type) {
  try {
    const status = await Permissions.check(type);
    const titleAlert = i18n.t('register:devicePermissionTitle', { type });
    const messageAlert = i18n.t('register:devicePermissionRestricted', {
      type
    });

    if (status === 'authorized') {
      return true;
    }

    if (IS_IOS && (status === 'restricted' || status === 'denied')) {
      const restartNote = i18n.t('global:willRestart');
      await showAlertInfo(titleAlert, `${messageAlert}\n(${restartNote})`);
      const canOpenSettings = await Permissions.canOpenSettings();

      if (canOpenSettings) {
        Permissions.openSettings();
      }

      return false;
    } else if (!IS_IOS && status === 'restricted') {
      await showAlertInfo(titleAlert, messageAlert);

      return false;
    }

    const permRequest = await Permissions.request(type);
    await remoteLoggerService.info(
      'requestPermission',
      `Permission for "${type}" return: "${permRequest}".`
    );

    return permRequest === 'authorized';
  } catch (error) {
    await remoteLoggerService.error(
      'requestPermission',
      `Permission for "${type}" return: "${error.message}".`,
      error
    );
    return false;
  }
}

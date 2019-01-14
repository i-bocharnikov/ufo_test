import { Platform } from 'react-native';
import Permissions from 'react-native-permissions';
import i18n from 'i18next';

import logger, { codeTypes, severityTypes } from './userActionsLogger';
import { showAlertInfo } from './interaction';

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
    const messageAlert = i18n.t('register:devicePermissionRestricted', { type });

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
    await logPermissionRequest(type, permRequest);

    return permRequest === 'authorized';
  } catch (error) {
    await logPermissionException(error);

    return false;
  }
}

/* below fn are used for logging at server */
async function logPermissionRequest(type, result) {
  await logger(
    severityTypes.INFO,
    codeTypes.SUCCESS,
    'requestPermission',
    `Permission for "${type}" was asked.\n Result: "${result}".`
  );
}

async function logPermissionException(error) {
  await logger(
    severityTypes.ERROR,
    codeTypes.ERROR,
    'requestPermission',
    'Permission exception',
    error
  );
}

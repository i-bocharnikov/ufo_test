import Permissions from 'react-native-permissions';

import logger, { codeTypes, severityTypes } from './userActionsLogger';

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

    if (status === 'authorized') {
      return true;
    }

    const permRequest = await Permissions.request(type);
    await logger(
        severityTypes.INFO,
        codeTypes.SUCCESS,
        'requestPermission',
        `Permission for "${type}" was asked.\n Result: "${permRequest}".`
    );

    return permRequest === 'authorized';
  } catch (error) {
    await logger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'requestPermission',
        'Permission exception',
        error
    );

    return false;
  }
}

import Permissions from 'react-native-permissions';

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

    return permRequest === 'authorized';
  } catch (error) {
    console.log('Permission manager error', error);
    
    return false;
  }
}

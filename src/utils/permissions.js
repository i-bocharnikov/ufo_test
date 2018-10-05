import Permissions from 'react-native-permissions'
//https://github.com/yonahforst/react-native-permissions


export async function checkAndRequestLocationPermission() {

  return await checkAndRequestPermission('location')
}

export async function checkAndRequestBluetoothPermission() {

  return await checkAndRequestPermission('bluetooth')
}

export async function checkAndRequestCameraPermission() {

  return await checkAndRequestPermission('camera')
}

async function checkAndRequestPermission(type) {

  let response = await Permissions.check(type)
  if (response !== 'authorized') {
    response = Permissions.request(type)
    return response === 'authorized'
  }
  return true
}


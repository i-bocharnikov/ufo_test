import { AsyncStorage } from 'react-native';

const AUTHENTICATION_TOKEN_STORAGE_KEY = 'driverState:AuthenticationToken';
const AUTHENTICATION_UUID_STORAGE_KEY = 'driverState:AuthenticationUUID';
const AUTHENTICATION_PASSWORD_STORAGE_KEY = 'driverState:AuthenticationPASSWORD';

export function getAuthenticationToken() {
  return AsyncStorage.getItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
}

export async function setAuthenticationToken(token) {
  return AsyncStorage.setItem(AUTHENTICATION_TOKEN_STORAGE_KEY, token);
}

export function getAuthenticationUUID() {
  return AsyncStorage.getItem(AUTHENTICATION_UUID_STORAGE_KEY);
}

export async function setAuthenticationUUID(uuid) {
  return AsyncStorage.setItem(AUTHENTICATION_UUID_STORAGE_KEY, uuid);
}

export function getAuthenticationPassword() {
  return AsyncStorage.getItem(AUTHENTICATION_PASSWORD_STORAGE_KEY);
}

export async function setAuthenticationPassword(password) {
  return AsyncStorage.setItem(AUTHENTICATION_PASSWORD_STORAGE_KEY, password);
}

export async function clearAuthentications() {
  await AsyncStorage.removeItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
  await AsyncStorage.removeItem(AUTHENTICATION_UUID_STORAGE_KEY);
  await AsyncStorage.removeItem(AUTHENTICATION_PASSWORD_STORAGE_KEY);
  return
}

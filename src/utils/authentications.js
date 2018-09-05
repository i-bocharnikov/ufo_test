import { AsyncStorage } from 'react-native';

const AUTHENTICATION_TOKEN_STORAGE_KEY = 'driverState:AuthenticationToken';
const AUTHENTICATION_UUID_STORAGE_KEY = 'driverState:AuthenticationUUID';
const AUTHENTICATION_PASSWORD_STORAGE_KEY = 'driverState:AuthenticationPASSWORD';

export function getAuthenticationTokenFromStore() {
  return AsyncStorage.getItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
}

export async function setAuthenticationTokenInStore(token) {
  return AsyncStorage.setItem(AUTHENTICATION_TOKEN_STORAGE_KEY, token);
}

export function getAuthenticationUUIDFromStore() {
  return AsyncStorage.getItem(AUTHENTICATION_UUID_STORAGE_KEY);
}

export async function setAuthenticationUUIDInStore(uuid) {
  return AsyncStorage.setItem(AUTHENTICATION_UUID_STORAGE_KEY, uuid);
}

export function getAuthenticationPasswordFromStore() {
  return AsyncStorage.getItem(AUTHENTICATION_PASSWORD_STORAGE_KEY);
}

export async function setAuthenticationPasswordInStore(password) {
  return AsyncStorage.setItem(AUTHENTICATION_PASSWORD_STORAGE_KEY, password);
}

export async function clearAuthenticationsFromStore() {
  await AsyncStorage.removeItem(AUTHENTICATION_TOKEN_STORAGE_KEY);
  await AsyncStorage.removeItem(AUTHENTICATION_UUID_STORAGE_KEY);
  await AsyncStorage.removeItem(AUTHENTICATION_PASSWORD_STORAGE_KEY);
  return
}

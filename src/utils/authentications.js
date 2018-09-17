import SInfo from 'react-native-sensitive-info';

const AUTHENTICATION_TOKEN_STORAGE_KEY: string = "AT";
const AUTHENTICATION_UUID_STORAGE_KEY: string = "AU";
const AUTHENTICATION_PASSWORD_STORAGE_KEY: string = "AP";

const options = {
  sharedPreferencesName: 'myUFOPrefs',
  keychainService: 'myUFOKeychain'
}

export async function getAuthenticationTokenFromStore() {
  return await SInfo.getItem(AUTHENTICATION_TOKEN_STORAGE_KEY, options);
}

export async function setAuthenticationTokenInStore(token: string) {
  return await SInfo.setItem(AUTHENTICATION_TOKEN_STORAGE_KEY, token, options);
}

export async function getAuthenticationUUIDFromStore() {
  return await SInfo.getItem(AUTHENTICATION_UUID_STORAGE_KEY, options);
}

export async function setAuthenticationUUIDInStore(uuid: string) {
  return await SInfo.setItem(AUTHENTICATION_UUID_STORAGE_KEY, uuid, options);
}

export async function getAuthenticationPasswordFromStore() {
  return await SInfo.getItem(AUTHENTICATION_PASSWORD_STORAGE_KEY, options);
}

export async function setAuthenticationPasswordInStore(password: string) {
  return await SInfo.setItem(AUTHENTICATION_PASSWORD_STORAGE_KEY, password, options);
}

export async function clearAuthenticationsFromStore() {
  await SInfo.deleteItem(AUTHENTICATION_TOKEN_STORAGE_KEY, options);
  await SInfo.deleteItem(AUTHENTICATION_UUID_STORAGE_KEY, options);
  await SInfo.deleteItem(AUTHENTICATION_PASSWORD_STORAGE_KEY, options);
  return
}

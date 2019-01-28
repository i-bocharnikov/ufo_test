import { Platform } from 'react-native';
import packageJson from './../../package.json';

const localhost = 'localhost';

const UFO_APP_NAME = packageJson.name;
const UFO_APP_VERSION = packageJson.version;
const UFO_APP_BUILD_NUMBER = packageJson.build;

export const GOOGLE_API_KEY =
  Platform.OS === 'ios'
    ? 'AIzaSyCMxOEjyOc71uyrnbojuJ7sv-R-aXF8V60'
    : 'AIzaSyBfooZt1k3tKzysBaeityPO8cKGCje3n-w';

const development = {
  UFO_APP_USAGE: 'LOCAL',
  UFO_APP_NAME: UFO_APP_NAME,
  UFO_APP_VERSION: UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: UFO_APP_BUILD_NUMBER,
  UFO_SERVER_API_URL: `http://${localhost}:1337/ufodrive/1.0.0/`,
  UFO_SERVER_API_VERSION: 'v2',
  UFO_SERVER_DEPRECATED_API_VERSION: 'v1'
};

const uat = {
  UFO_APP_USAGE: 'UAT',
  UFO_APP_NAME: UFO_APP_NAME,
  UFO_APP_VERSION: UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: UFO_APP_BUILD_NUMBER,
  UFO_SERVER_API_URL: 'https://back-uft.ufodrive.com/ufodrive/1.0.0/',
  UFO_SERVER_API_VERSION: 'v2',
  UFO_SERVER_DEPRECATED_API_VERSION: 'v1'
};

const production = {
  UFO_APP_USAGE: 'PRODUCTION',
  UFO_APP_NAME: UFO_APP_NAME,
  UFO_APP_VERSION: UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: UFO_APP_BUILD_NUMBER,
  UFO_SERVER_API_URL: 'https://back.ufodrive.com/ufodrive/1.0.0/',
  UFO_SERVER_API_VERSION: 'v2',
  UFO_SERVER_DEPRECATED_API_VERSION: 'v1'
};

//const configurations = { ...development, theme: 'UFO' };
//const configurations = { ...production, theme: 'UFO' };
const configurations = { ...uat, theme: 'UFO' };

configurations.UFO_SERVER_PRIVATE_API_URL = `${
  configurations.UFO_SERVER_API_URL
}api/`;
configurations.UFO_SERVER_PUBLIC_API_URL = `${
  configurations.UFO_SERVER_API_URL
}public/api/`;

export default configurations;

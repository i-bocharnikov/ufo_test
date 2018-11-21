import packageJson from './../../package.json';

const localhost = '192.168.178.97'; //IMac Pfafenthall

const UFO_APP_NAME = packageJson.name;
const UFO_APP_VERSION = packageJson.version;

const development = {
  UFO_APP_USAGE: 'LOCAL',
  UFO_APP_NAME,
  UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: '002',
  UFO_SERVER_API_URL: `http://${localhost}:1337/ufodrive/1.0.0/`,
  UFO_SERVER_API_VERSION: 'v1'
};

const uat = {
  UFO_APP_USAGE: 'UAT',
  UFO_APP_NAME,
  UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: '002',
  UFO_SERVER_API_URL: 'https://back-uft.ufodrive.com/ufodrive/1.0.0/',
  UFO_SERVER_API_VERSION: 'v1'
};

const production = {
  UFO_APP_USAGE: 'PRODUCTION',
  UFO_APP_NAME,
  UFO_APP_VERSION,
  UFO_APP_BUILD_NUMBER: '001',
  UFO_SERVER_API_URL: 'https://back.ufodrive.com/ufodrive/1.0.0/',
  UFO_SERVER_API_VERSION: 'v1'
};

//const configurations = { ...development, theme: 'UFO' };
//const configurations = { ...production, theme: 'UFO' };
const configurations = { ...uat, theme: 'UFO' };

configurations.UFO_SERVER_PRIVATE_API_URL = `${configurations.UFO_SERVER_API_URL}api/${configurations.UFO_SERVER_API_VERSION}/`;

configurations.UFO_SERVER_PUBLIC_API_URL = `${configurations.UFO_SERVER_API_URL}public/api/${configurations.UFO_SERVER_API_VERSION}/`;

export default configurations;

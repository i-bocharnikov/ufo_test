import i18n from 'i18next';
import moment from 'moment';
import 'moment/locale/fr';
import DeviceInfo from 'react-native-device-info';

import en from './en';
import fr from './fr';

const RESOURCES = { en, fr };
const DEFAULT_LOCALE = 'en';

function getAppLocale() {
  const deviceLocale = DeviceInfo.getDeviceLocale();

  if (typeof deviceLocale !== 'string') {
    return DEFAULT_LOCALE;
  }

  const locale = deviceLocale.split('-')[0];
  const supportedLocales = Object.keys(RESOURCES);
  return supportedLocales.find(item => item === locale) || DEFAULT_LOCALE;
}

const languageDetector = {
  type: 'languageDetector',
  detect: getAppLocale,
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n.use(languageDetector).init({
  resources: RESOURCES,
  fallbackLng: DEFAULT_LOCALE,
  debug: false,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { wait: true }
});

moment.locale(i18n.language);

export default i18n;

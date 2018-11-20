import i18n from 'i18next';
import LanguageDetector from 'i18next-react-native-language-detector';
import { LocaleConfig } from 'react-native-calendars';

import en from './en';
import fr from './fr';
import './en_calendar';
import './fr_calendar';

i18n.use(LanguageDetector).init({
  resources: { en, fr },
  fallbackLng: 'en',
  debug: false,
  ns: [ 'translations' ],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { wait: true }
});

LocaleConfig.defaultLocale = 'en';

export default i18n;

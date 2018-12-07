import i18n from 'i18next';
import LanguageDetector from 'i18next-react-native-language-detector';
import moment from 'moment';
import 'moment/locale/fr';

import en from './en';
import fr from './fr';

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

moment.locale(i18n.language);


export default i18n;

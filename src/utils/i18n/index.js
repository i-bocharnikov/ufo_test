import i18n from "i18next";
import moment from "moment";
import "moment/locale/fr";
import DeviceInfo from "react-native-device-info";

import en from "./en";
import fr from "./fr";

const languageDetector = {
  type: "languageDetector",
  detect: () => DeviceInfo.getDeviceLocale(),
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n.use(languageDetector).init({
  resources: { en, fr },
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  interpolation: { escapeValue: false },
  react: { wait: true }
});

moment.locale(i18n.language);

export default i18n;

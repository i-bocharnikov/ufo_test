import i18n from "i18next";
import LanguageDetector from 'i18next-react-native-language-detector'

i18n.use(LanguageDetector).init({
    // we init with resources
    resources: {
        en: {
            activities: {
                "internetAccessFailure": "Unexpected internet connectivity issues. Operating in offline/degraded mode",
                "bluetoothAccessFailure": "Unexpected bluetooth connectivity issues. Operating in offline/degraded mode",
            },
            home: {
                "welcome": "Hello {{user.reference}}, What is next ?",
            },
            register: {
                "overviewTitle": "Registration {{user.reference}}",
                "phoneNumberLabel": "Phone",
                "emailLabel": "Email",
                "addressLabel": "Address",
            }
        },
        fr: {
            home: {
                "welcome": "Bonjour {{user.reference}}, voici les prochaine actions?",
            }
        }
    },
    fallbackLng: "en",
    debug: false,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
        escapeValue: false, // not needed for react!!
    },

    react: {
        wait: true
    }
});

export default i18n;

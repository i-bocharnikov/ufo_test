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
            icon: {
                "reserve": "Reserve",
                "register": "Register",
                "drive": "Drive",
                "back": "Back",
                "next": "Next",
                "home": "Home",
                "connect": "Connect",
                "disconnect": "Disconnect",
                "requestCode": "Request code",
            },
            register: {
                "overviewTitle": "Registration {{user.reference}} {{user.status}}",
                "phoneTitle": "Register - Phone",
                "phoneNumberLabel": "Phone",
                "phoneNumberInputLabel": "Your mobile phone number",
                "emailTitle": "Register Email",
                "emailInputLabel": "Your email address",
                "emailLabel": "Email",
                "smsCodeInputLabel": "The code received by SMS",
                "addressLabel": "Address",
            },
            reserve: {
                "reserveLocationTitle": "Select the location",
                "reserveDateAndCarTitle": "Select the date and car",
                "reservePaymentTitle": "Confirm",
            },
            support: {
                "supportTitle": "How can we help you?",
            },
            drive: {
                "driveTitle": "Rental",
            },
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

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
            global: {
                "confirmationTitle": "Confirmation needed",
                "confirmationOk": "OK",
                "confirmationCancel": "Cancel",
            },
            icon: {
                "reserve": "Reserve",
                "register": "Register",
                "drive": "Drive",
                "find": "Find",
                "inspect": "Inpect",
                "return": "Return",
                "rentalAgreement": "Start contract",
                "drive": "Drive",
                "back": "Back",
                "next": "Next",
                "slidePrevious": "Slide previous",
                "slideNext": "Slide next",
                "home": "Home",
                "continueLater": "Continue later",
                "connect": "Connect",
                "disconnect": "Disconnect",
                "requestCode": "Request code",
                "phone": "Phone Number",
                "email": "Email",
                "address": "Address",
                "identification": "Identification",
                "driverLicence": "Driver licence",
                "select": "Select",
                "capture": "Capture",
                "newCapture": "New capture",
                "torch": "Torch",
                "validate": "Validate",
                "cancel": "Cancel",
                "redo": "Retry",
                "skip": "Skip",
                "segmentOpen": "Open",
                "segmentClose": "Close",
                "chat": "Chat support",
                "emergencyCall": "Emergency call",
            },
            register: {
                "overviewTitle": "Registration {{user.reference}} {{user.status}}",
                "phoneTitle": "Register - Phone",
                "phoneNumberLabel": "Phone",
                "phoneNumberInputLabel": "Your mobile phone number",
                "emailTitle": "Register Email",
                "emailInputLabel": "Your email address",
                "emailLabel": "Email",
                "addressTitle": "Register Address",
                "addressInputLabel": "Your billing address",
                "addressInputPlaceholder": 'Street, number, postal code, city and country',
                "addressLabel": "Billing address",
                "smsCodeInputLabel": "The code received by SMS",
                "addressLabel": "Address",
                "identificationTitle": "Register ID",
                "identificationLabel": "ID or Passport",
                "identificationFrontInputLabel": "Please hold the front side of your id card or passport inside this rectangle",
                "identificationCheckLabel": "Please check that the text is readable and the whole document is visible",
                "identificationBackInputLabel": "Please hold the back side of your id card or passport inside this rectangle. Press back is there is no back side.",
                "driverLicenceTitle": "Register driver licence",
                "driverLicenceLabel": "Driver licence",
                "driverLicenceFrontInputLabel": "Please hold the front side of your driver licence inside this rectangle",
                "driverLicenceCheckLabel": "Please check that the text is readable and the whole document is visible",
                "driverLicenceBackInputLabel": "Please hold the back side of your id card or passport inside this rectangle. Press back is there is no back side.",
                "CameraNotAvailable": "The camera is not available",
                "CameraProcessingError": "Unexpected issues detected during the image processing of the camera ({{message}}). Please try again and contact the support if the problem persist.",
                "cameraPermissionTitle": 'Permission to use camera',
                "cameraPermissionMessage": 'We need your permission to use your camera phone',
                "disconnectConfirmationMessage": "are you sure you want to disconnect?",

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
                "inspectTitle": "Inspection",
                "findTitle": "Where is the car",
                "returnTitle": "How to return",
                "rentalAgreementTitle": "Sign the agreement",
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

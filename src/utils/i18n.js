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
                "welcome": "Hello, follow those steps and enjoy the drive",
                "reserve": "1. Reserve a car",
                "register": "2. Register your profile",
                "drive": "3. Drive your rented car",
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
                "login": "Connect",
                "logout": "Disconnect",
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
                "add": "Add",
                "unlock": "Unlock",
                "lock": "Lock",
                "start": "Start",
                "stop": "Stop",
                "connect": "Connect",
                "key": "Key",
                "sign": "Sign",

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
            inspect: {
                "inspectTitle": "Inspection",
                "inspectGuidance": "Confirm the car conforms to the condition described below:",
                "locateDamageTitle": "Declare damage 1/3",
                "locateGuidance": "Locate the damage on the picture below",
                "captureDamageTitle": "Capture damage 2/3",
                "captureGuidance": "Capture the damage",
                "captureCheckGuidance": "Please check that the damage is visible",
                "commentDamageTitle": "Comment damage 3/3",
                "commentGuidance": "Add a comment",
                "commentPlaceholder": "your comment",
                "confirmInitialInspectionConfirmationMessage": "You are about to confirm car condition is conform to the description on the screen. Please note you will not be able to change it once you will have pressed 'Confirm'. thanks You."
            },
            reserve: {
                "reserveTitle": "Book a car",
                "reserveLocationTitle": "Select the location",
                "reserveDateAndCarTitle": "Select the date and car",
                "reservePaymentTitle": "Confirm",
                "bookingLink": "This section is under development. In the meantime, please follow this link to book a car"
            },
            support: {
                "supportTitle": "How can we help you?",
            },
            drive: {
                "driveTitle": "Rental",
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

import i18n from 'i18next';
import LanguageDetector from 'i18next-react-native-language-detector'

i18n.use(LanguageDetector).init({
    // we init with resources
    resources: {
        en: {
            common: {
                "okBtn": "OK",
                "cancelBtn": "Cancel"
            },
            activities: {
                "internetAccessFailure": "Unexpected internet connectivity issues. Operating in offline/degraded mode",
                "bluetoothAccessFailure": "Unexpected bluetooth connectivity issues. Operating in offline/degraded mode",
                "internetbluetoothAccessFailure": "Unexpected internet and bluetooth connectivity issues. Operating in offline/degraded mode",
            },
            home: {
                "reserve": "1. Reserve a car",
                "register": "2. Register your profile",
                "drive": "3. Drive your rented car",
            },
            global: {
                "confirmationTitle": "Confirmation needed",
                "confirmationOk": "OK",
                "confirmationCancel": "Cancel",
            },
            error: {
                "internetConnectionRequired": "This operation requires an internet connection",
                "bluetoothConnectionRequired": "This operation requires a blootooth connection",
                "unexpectedServerResponse": "Oops, this was not supposed to happen. Apologises for the inconvenience",
                "noKey": "You currently have no key. Please ask support team to have one",
                "stringNotMatch": "Wrong confirmation string. Try again"
            },
            icon: {
                "reserve": "Reserve",
                "register": "Register",
                "myDetails": "My details",
                "drive": "Drive",
                "find": "Find",
                "found": "Car found",
                "inspect": "Inspect",
                "return": "Return",
                "where": "Where",
                "rentalAgreement": "Start rental",
                "drive": "Drive",
                "back": "Back",
                "next": "Next",
                "slidePrevious": "Slide previous",
                "slideNext": "Slide next",
                "home": "Home",
                "continueLater": "Continue later",
                "login": "Connect",
                "logout": "Disconnect",
                "resendCode": "Resend code",
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
                "done": "Done",
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
                "connect": "Connect car",
                "key": "Key",
                "sign": "Sign",
                "clipboard": "clipboard",
                "browse": "Open browser",
                "closeRental": "Close rental",
                "emergencyCall": "Emergency call",
            },
            register: {
                "overviewTitle": "Registration",
                "phoneTitle": "Register - Phone",
                "phoneNumberLabel": "Phone",
                "phoneNumberInputLabel": "Your mobile phone number",
                "emailTitle": "Register Email",
                "emailInputLabel": "Your email address",
                "emailLabel": "Email",
                "addressTitle": "Register Address",
                "addressInputLabel": "Your billing address",
                "addressInputPlaceholder": 'Street, number, post code, city and country',
                "addressLabel": "Billing address",
                "smsCodeInputLabel": "The code received by SMS",
                "addressLabel": "Address",
                "identificationTitle": "Register ID",
                "identificationLabel": "ID or Passport",
                "identificationFrontInputLabel": "Please position the front side of your ID card or passport inside this rectangle",
                "identificationCheckLabel": "Please check that the text is readable and that the whole document is visible",
                "identificationBackInputLabel": "Please position the back side of your ID card or passport inside this rectangle.",
                "driverLicenceTitle": "Register driver licence",
                "driverLicenceLabel": "Driver licence",
                "driverLicenceFrontInputLabel": "Please position the front side of your driver licence inside this rectangle",
                "driverLicenceCheckLabel": "Please check that the text is readable and the whole document is visible",
                "driverLicenceBackInputLabel": "Please position the back side of your driver licence inside this rectangle.",
                "CameraNotAvailable": "The camera is not available",
                "CameraProcessingError": "Unexpected issues detected during the image processing of the camera ({{message}}). Please try again and/or contact the support team if the problem persists.",
                "cameraPermissionTitle": 'Permission to use camera',
                "cameraPermissionMessage": 'We need your permission to use your phone\'s camera',
                "disconnectConfirmationMessage": "Are you sure you want to disconnect?",

            },
            inspect: {
                "initialInspectionTitle": "Initial inspection",
                "finalInspectionTitle": "Declare damage(s)",
                "inspectGuidance": "Confirm the car conforms to the condition described below:",
                "locateDamageTitle": "Declare damage 1/3",
                "locateGuidance": "Locate the damage on the picture below",
                "captureDamageTitle": "Capture damage 2/3",
                "captureGuidance": "Capture the damage",
                "captureCheckGuidance": "Please check that the damage is visible",
                "commentDamageTitle": "Describe damage 3/3",
                "commentGuidance": "Add a comment",
                "commentPlaceholder": "your comment",
                "confirmInspectionConfirmationMessage": "You are about to confirm the car condition conforms to the description on the screen.\nThank you."
            },
            reserve: {
                "reserveTitle": "Reserve",
                "reserveLocationTitle": "Select the location",
                "reserveDateAndCarTitle": "Select the date and car",
                "reservePaymentTitle": "Confirm",
                "bookingLink": "Coming soon, please follow this link to book a car"
            },
            support: {
                "supportTitle": "How can we help you?",
            },
            drive: {
                "driveTitle": "Rental",
                "rentalReference": "Rental {{rental.reference}} {{rental.status}}",
                "rentalStartAt": "From {{start_at}}",
                "rentalEndAt": "to {{end_at}}",
                "rentalLocation": "{{rental.location.name}}",
                "rentalCar": "{{rental.car.reference}}",
                "rentalCarModel": "{{rental.car.car_model.manufacturer}} {{rental.car.car_model.name}}",
                "noRentalsTitle": "No rentals",
                "noRentalsDescription": "After booking, the actions below will be activated and will allow you to find the car, inspect it, start the rental contract and finally lock/unlock the vehicle",
                "confirmCloseRentalConfirmationMessage": "You are about to end your rental contract.{{keyMessage}}\nThe car will then lock automatically so please ensure you don't leave any personal belongings in the car as you will not be able to open it once you press 'OK'.\nThank you.",
                "confirmCloseRentalKeyMessageConfirmationMessage": "\nPLEASE PUT THE KEY BACK IN THE GLOVEBOX.",
                "noKey": "No key",
                "notConnected": "Not connected",
                "connecting": "...Connecting...",
                "locked": "Doors locked",
                "unlocked": "Doors unlocked",
                "noData": "...",
            },
            guide: {
                "findTitle": "Where is the car",
                "returnTitle": "How to return",
            },
            term: {
                "rentalAgreementTitle": "Sign the agreement",
                "confirmContractDescription": "By signing, I certify that I have read and fully accepted the terms and conditions.",
                "confirmContractTitle": "Enter \"{{strKey}}\" to confirm",
                "confirmContractKeyString": "I agree",
            },
        },
        fr: {
            home: {
                "welcome": "Bonjour {{user.reference}}, voici les prochaine actions?",
            },
            term: {
                "confirmContractTitle": "Enter \"{{strKey}}\" to confirm",
                "confirmContractKeyString": "Je suis d'accord",
            },
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

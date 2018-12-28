import otaKeyNativeErrors from './en_otaKeyNativeErrors';

export default {
  common: {
    'okBtn': 'OK',
    'cancelBtn': 'Cancel',
    'closeBtn': 'close',
    'modeAuto': 'auto',
    'modeOn': 'on',
    'modeOff': 'off',
    'calendarTitle': 'SELECT DATE',
    'saveBtn': 'Save',
    'scheduleFrom': 'from',
    'scheduleTo': 'to'
  },
  activities: {
    'internetAccessFailure': 'Unexpected internet connectivity issues. Operating in offline/degraded mode',
    'bluetoothAccessFailure': 'Unexpected bluetooth connectivity issues. Operating in offline/degraded mode',
    'internetbluetoothAccessFailure': 'Unexpected internet and bluetooth connectivity issues. Operating in offline/degraded mode'
  },
  home: {
    'reserve': '1. Reserve a car',
    'register': '2. Register your profile',
    'drive': '3. Drive your rented car'
  },
  global: {
    'confirmationTitle': 'Confirmation needed',
    'confirmationOk': 'OK',
    'confirmationCancel': 'Cancel'
  },
  error: {
    'error': 'Error',
    'internetConnectionRequired': 'This operation requires an internet connection',
    'bluetoothConnectionRequired': 'This operation requires a blootooth connection',
    'unexpectedServerResponse': 'Oops, this was not supposed to happen. Apologises for the inconvenience',
    'noKey': 'You currently have no key. Please ask support team to have one',
    'stringNotMatch': 'Wrong confirmation string. Try again',
    'unknown': 'Unknown Error',
    'nativeException': 'Native Exception',
    'jsException': 'Warning from JS exception handler',
    'jsExceptionFatal': 'Fatal JS exception',
    'jsExceptionFatalReport': 'We have reported this to our team. Please close the app and start again.',
    'localPermissionNeeded': 'Location permission is required to access the car'
  },
  icon: {
    'reserve': 'Reserve',
    'register': 'Register',
    'myDetails': 'My details',
    'drive': 'Drive',
    'find': 'Find',
    'found': 'Car found',
    'inspect': 'Inspect',
    'return': 'Return',
    'where': 'Where',
    'rentalAgreement': 'Start rental',
    'back': 'Back',
    'next': 'Next',
    'slidePrevious': 'Slide previous',
    'slideNext': 'Slide next',
    'home': 'Home',
    'continueLater': 'Continue later',
    'login': 'Connect',
    'logout': 'Disconnect',
    'resendCode': 'Resend code',
    'phone': 'Phone Number',
    'email': 'Email',
    'address': 'Address',
    'identification': 'Identification',
    'driverLicence': 'Driver licence',
    'select': 'Select',
    'capture': 'Capture',
    'newCapture': 'New capture',
    'torch': 'Torch',
    'validate': 'Validate',
    'done': 'Done',
    'cancel': 'Cancel',
    'redo': 'Retry',
    'skip': 'Skip',
    'segmentOpen': 'Open',
    'segmentClose': 'Close',
    'chat': 'Chat support',
    'add': 'Add',
    'unlock': 'Unlock',
    'lock': 'Lock',
    'start': 'Start',
    'stop': 'Stop',
    'connect': 'Connect car',
    'key': 'Key',
    'sign': 'Sign',
    'clipboard': 'clipboard',
    'browse': 'Open browser',
    'closeRental': 'Close rental',
    'emergencyCall': 'Emergency call'
  },
  register: {
    'overviewTitle': 'Registration',
    'phoneTitle': 'Register - Phone',
    'phoneNumberLabel': 'Phone',
    'phoneNumberInputLabel': 'Phone number',
    'emailTitle': 'Register Email',
    'emailInputLabel': 'Email',
    'emailLabel': 'Email',
    'addressTitle': 'Register Address',
    'addressInputLabel': 'Your billing address',
    'addressInputPlaceholder': 'Street, number, post code, city and country',
    'smsCodeInputLabel': 'The code received by SMS',
    'addressLabel': 'Address',
    'identificationTitle': 'Register ID',
    'identificationLabel': 'ID or Passport',
    'identificationFrontInputLabel': 'Please position the front side of your ID card or passport inside this rectangle',
    'identificationCheckLabel': 'Please check that the text is readable and that the whole document is visible',
    'identificationBackInputLabel': 'Please position the back side of your ID card or passport inside this rectangle.',
    'driverLicenceTitle': 'Register driver licence',
    'driverLicenceLabel': 'Driver licence',
    'driverLicenceFrontInputLabel': 'Please position the front side of your driver licence inside this rectangle',
    'driverLicenceCheckLabel': 'Please check that the text is readable and the whole document is visible',
    'driverLicenceBackInputLabel': 'Please position the back side of your driver licence inside this rectangle.',
    'CameraNotAvailable': 'The camera is not available',
    'CameraProcessingError': 'Unexpected issues detected during the image processing of the camera ({{message}}). Please try again and/or contact the support team if the problem persists.',
    'cameraPermissionTitle': 'Permission to use camera',
    'cameraPermissionMessage': 'We need your permission to use your phone\'s camera',
    'disconnectConfirmationMessage': 'Are you sure you want to disconnect?',
    'idCardPickerLabel': 'Passport\nor ID card',
    'driveCardPickerLabel': 'Driving\nLicense',
    'shareDialogTitle': 'Share referal code',
    'referalBlock': 'Referal Code {{code}}',
    'referalCodeMessage': 'You can use my UFODRIVE referral code {{code}} to get €30 off of your first ride, and drive to space!',
    'restrictedCamera': 'To use camera activate it in the phone settings'
  },
  inspect: {
    'initialInspectionTitle': 'Initial inspection',
    'finalInspectionTitle': 'Declare damage(s)',
    'inspectGuidance': 'Confirm the car conforms to the condition described below:',
    'locateDamageTitle': 'Declare damage 1/3',
    'locateGuidance': 'Locate the damage on the picture below',
    'captureDamageTitle': 'Capture damage 2/3',
    'captureGuidance': 'Capture the damage',
    'captureCheckGuidance': 'Please check that the damage is visible',
    'commentDamageTitle': 'Describe damage 3/3',
    'commentGuidance': 'Add a comment',
    'commentPlaceholder': 'your comment',
    'confirmInspectionConfirmationMessage': 'You are about to confirm the car condition conforms to the description on the screen.\nThank you.',
    'damageCardTitle': 'Damage {{index}}/{{amount}}'
  },
  reserve: {
    'reserveTitle': 'Reserve',
    'reserveLocationTitle': 'Select the location',
    'reserveDateAndCarTitle': 'Select the date and car',
    'reservePaymentTitle': 'Confirm',
    'bookingLink': 'Coming soon, please follow this link to book a car'
  },
  support: { 'supportTitle': 'How can we help you?' },
  drive: {
    'driveTitle': 'Rental',
    'rentalReference': 'Rental {{rental.reference}} {{rental.status}}',
    'rentalStartAt': 'From {{start_at}}',
    'rentalEndAt': 'to {{end_at}}',
    'rentalLocation': '{{rental.location.name}}',
    'rentalCar': '{{rental.car.reference}}',
    'rentalCarModel': '{{rental.car.car_model.manufacturer}} {{rental.car.car_model.name}}',
    'noRentalsTitle': 'No rentals',
    'noRentalsDescription': 'After booking, the actions below will be activated and will allow you to find the car, inspect it, start the rental contract and finally lock/unlock the vehicle',
    'confirmCloseRentalConfirmationMessage': 'You are about to end your rental contract.{{keyMessage}}\nThe car will then lock automatically so please ensure you don\'t leave any personal belongings in the car as you will not be able to open it once you press \'OK\'.\nThank you.',
    'confirmCloseRentalKeyMessageConfirmationMessage': '\nPLEASE PUT THE KEY BACK IN THE GLOVEBOX.',
    'noKey': 'No key',
    'notConnected': 'Not connected',
    'connecting': '...Connecting...',
    'locked': 'Doors locked',
    'unlocked': 'Doors unlocked',
    'noData': '...'
  },
  guide: {
    'findTitle': 'Where is the car',
    'returnTitle': 'How to return'
  },
  term: {
    'rentalAgreementTitle': 'Sign the agreement',
    'confirmContractDescription': 'By signing, I certify that I have read and fully accepted the terms and conditions.',
    'confirmContractTitle': 'Enter \'{{strKey}}\' to confirm',
    'confirmContractKeyString': 'I agree'
  },
  booking: {
    'screenTitle': 'Book your car',
    'subTitleStep1': 'BOOK',
    'subTitleStep2': 'PAY & CONFIRM',
    'subTitleStep3': 'DRIVE',
    'locSectionTitle': 'LOCATION',
    'carsSectionTitle': 'CARS',
    'timeSectionTitle': 'PICK-UP & RETURN TIME',
    'notFoundData': 'Data not found',
    'infoLink': 'infos',
    'datesTooltip': 'Enter your pick-up & return date here. You can also use the calendar view.\nNeed more help? ',
    'tooltipLink': 'Contact us',
    'dareSectionTitle': 'PICK-UP & RETURN DATE',
    'totalPrice': 'TOTAL',
    'stepBookNextTitle': 'FILL YOUR\nINFOS',
    'stepBookNextSubTitle': 'Go to step 2',
    'calendarViewBtn': 'open calendar view',
    'locationInfoTitle': 'LOCATION',
    'carInfoTitle': 'CAR',
    'infoRange': 'RANGE',
    'infoPeople': 'PEOPLE',
    'address': 'Address',
    'seclectInfoBtn': 'SELECT THIS',
    'unseclectInfoBtn': 'UNSELECT THIS',
    'stepPayNextTitle': 'CONFIRM',
    'stepPayNextSubTitle': 'Go to step 3',
    'creditCardTitle': 'CREDIT CARD INFOS',
    'loyalityProgramtitle': 'VOUCHER & LOYALTY PROGRAM',
    'infoAtPaymentTitle': 'BOOKING INFORMATIONS',
    'totalPricePayment': 'TOTAL ALL INCLUDED',
    'voucherPlaceholder': 'Voucher / referral code',
    'milesPlaceholder': 'Miles and more number',
    'voucherTooltip': 'Info about loyality program',
    'scanCreditCardBtn': 'Scan a new credit card',
    'applyBtn': 'APPLY\nALTERNATIVE',
    'pickUpAlt': 'Pickup',
    'returnAlt': 'Return',
    'noAvailableColor': 'no availability',
    'highDemandColor': 'high demand',
    'calendarColorsNotes': 'Select multiple dates to see discounts',
    'driveTitle': 'Booking completed!',
    'driveSubTitle': 'Enjoy your trip…',
    'driveNextRegister': 'REGISTER',
    'driveNextDrive': 'DRIVE YOUR CAR',
    'dreveDescrRegisterP1': 'Before the rental,please register youself by scanning your ID and driver licence. If you want to know more about how it works, ',
    'dreveDescrDriveP1': 'Find your bookings in the drive section of the app. If you want to know more about how it works, ',
    'dreveDescrGuideLink': 'read the guide.',
    'feedBackTitle': 'Just one question',
    'confirmDialog': 'DONE',
    'feedBackInputPlaceholder': 'Your variant'
  },
  launch: {
    'launchTitle': 'Fast track\ncar infos',
    'slideOneTitle': 'Fully automated',
    'slideTwoTitle': 'No hidden charges',
    'slideThreeTitle': 'Stylish electric cars',
    'slideOneSubTitle': 'and app based',
    'slideTwoSubTitle': 'and no refuelling cost',
    'slideThreeSubTitle': 'price all included',
    'slideOneDescription': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id tellus id orci gravida pellentesque. Quisque fermentu.',
    'slideTwoDescription': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id tellus id orci gravida pellentesque. Quisque fermentu.',
    'slideThreeDescription': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id tellus id.',
    'nextBtn': 'DISCOVER ALL CARS',
    'skipBtn': 'skip'
  },
  otaKeyNativeErrors
};

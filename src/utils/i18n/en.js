import otaKeyNativeErrors from './en_otaKeyNativeErrors';

export default {
  common: {
    okBtn: 'OK',
    cancelBtn: 'Cancel',
    closeBtn: 'close',
    modeAuto: 'auto',
    modeOn: 'on',
    modeOff: 'off',
    calendarTitle: 'SELECT DATE',
    saveBtn: 'Save',
    scheduleFrom: 'from',
    scheduleTo: 'to',
    postponeBtn: 'Ask me later',
    termsUrl: 'https://www.ufodrive.com/en/terms-and-conditions'
  },
  activities: {
    internetAccessFailure:
      'Unexpected internet connectivity issues. Operating in offline/degraded mode',
    bluetoothAccessFailure:
      'Unexpected bluetooth connectivity issues. Operating in offline/degraded mode',
    internetbluetoothAccessFailure:
      'Unexpected internet and bluetooth connectivity issues. Operating in offline/degraded mode'
  },
  global: {
    confirmationTitle: 'Confirmation needed',
    confirmationOk: 'OK',
    confirmationCancel: 'Cancel',
    willRestart: 'Application will be restarted'
  },
  error: {
    error: 'Error',
    internetConnectionRequired:
      'This operation requires an internet connection',
    bluetoothConnectionRequired:
      'This operation requires a blootooth connection',
    unexpectedServerResponse:
      'Oops, this was not supposed to happen. Apologises for the inconvenience',
    noKey: 'You currently have no key. Please ask support team to have one',
    stringNotMatch: 'Please type "I agree" to sign the contract.',
    unknown: 'Unknown Error',
    nativeException: 'Native Exception',
    jsException: 'Warning from JS exception handler',
    jsExceptionFatal: 'Fatal JS exception',
    jsExceptionFatalReport:
      'We have reported this to our team. Please close the app and start again.',
    localPermissionNeeded:
      'Location permission is required to access the car (please control system settings)',
    invalidCodeError: 'This code is not valid!',
    // it's not just var name - such format using 'context' in 'i18next'
    invalidCodeError_voucher: "Voucher code '{{code}}' is not valid",
    invalidCodeError_referal: "Referral code '{{code}}' is not valid",
    connectionIsRequired: 'Internet connectivity is required',
    rentalKeyMissing:
      'The key is missing, please contact UFODRIVE if the problem persist.',
    rentalNotOpen: 'The rental is not yet started, please wait...'
  },
  icon: {
    reserve: 'Reserve',
    register: 'Register',
    myDetails: 'My details',
    drive: 'Drive',
    find: 'Find',
    found: 'Car found',
    inspect: 'Inspect',
    return: 'Return',
    where: 'Where',
    rentalAgreement: 'Start rental',
    back: 'Back',
    next: 'Next',
    slidePrevious: 'Slide previous',
    slideNext: 'Slide next',
    home: 'Home',
    continueLater: 'Continue later',
    login: 'Login',
    logout: 'Logout',
    resendCode: 'Resend code',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address',
    identification: 'Identification',
    driverLicence: 'Driver licence',
    select: 'Select',
    capture: 'Capture',
    newCapture: 'Try again',
    torch: 'Torch',
    validate: 'Validate',
    done: 'Done',
    cancel: 'Cancel',
    redo: 'Retry',
    skip: 'Skip',
    segmentOpen: 'Open',
    segmentClose: 'Close',
    chat: 'Chat support',
    add: 'Add',
    unlock: 'Unlock',
    lock: 'Lock',
    start: 'Start',
    stop: 'Stop',
    connect: 'Connect car',
    key: 'Key',
    sign: 'Sign',
    clipboard: 'clipboard',
    browse: 'Open browser',
    closeRental: 'Close rental',
    emergencyCall: 'Emergency call'
  },
  register: {
    overviewTitle: 'Registration',
    phoneTitle: 'Register - Phone',
    phoneNumberLabel: 'Phone',
    phoneNumberInputLabel: 'Phone number',
    emailTitle: 'Register Email',
    emailInputLabel: 'Email',
    emailLabel: 'Email',
    addressTitle: 'Register Address',
    addressInputLabel: 'Your billing address',
    addressInputPlaceholder: 'Street, number, post code, city and country',
    smsCodeInputLabel: 'The code received by SMS',
    addressLabel: 'Address',
    identificationTitle: 'Register ID',
    identificationLabel: 'ID or Passport',
    identificationFrontInputLabel:
      'Please position the front side of your ID card or passport inside this rectangle',
    identificationCheckLabel:
      'Please check that the text is readable and that the whole document is visible',
    identificationBackInputLabel:
      'Please position the back side of your ID card or passport inside this rectangle.',
    driverLicenceTitle: 'Register driver licence',
    driverLicenceLabel: 'Driver licence',
    driverLicenceFrontInputLabel:
      'Please position the front side of your driver licence inside this rectangle',
    driverLicenceCheckLabel:
      'Please check that the text is readable and the whole document is visible',
    driverLicenceBackInputLabel:
      'Please position the back side of your driver licence inside this rectangle.',
    CameraNotAvailable: 'The camera is not available',
    CameraProcessingError:
      'Unexpected issues detected during the image processing of the camera ({{message}}). Please try again and/or contact the support team if the problem persists.',
    devicePermissionTitle: 'Permission to use {{type}}',
    cameraPermissionMessage:
      "We need your permission to use your phone's camera",
    disconnectConfirmationMessage: 'Are you sure you want to disconnect?',
    idCardPickerLabel: 'Passport\nor ID card',
    driveCardPickerLabel: 'Driving\nLicense',
    shareDialogTitle: 'Share referal code',
    referalBlock: 'Referal Code {{code}}',
    referalCodeMessage:
      'You can use my UFODRIVE referral code {{code}} to get €30 off of your first ride',
    devicePermissionRestricted:
      'To use {{type}} activate it in the phone settings'
  },
  inspect: {
    initialInspectionTitle: 'Initial inspection',
    finalInspectionTitle: 'Declare damage(s)',
    inspectGuidance:
      'Confirm the car conforms to the condition described below:',
    locateDamageTitle: 'Declare damage 1/3',
    locateGuidance: 'Locate the damage on the picture below',
    captureDamageTitle: 'Capture damage 2/3',
    captureGuidance: 'Capture the damage',
    captureCheckGuidance: 'Please check that the damage is visible',
    commentDamageTitle: 'Describe damage 3/3',
    commentGuidance: 'Add a comment',
    commentPlaceholder: 'your comment',
    confirmInspectionConfirmationMessage:
      'You are about to confirm the car condition conforms to the description on the screen.\nThank you.',
    damageCardTitle: 'Damage {{index}}/{{amount}}'
  },
  reserve: {
    reserveTitle: 'Reserve',
    reserveLocationTitle: 'Select the location',
    reserveDateAndCarTitle: 'Select the date and car',
    reservePaymentTitle: 'Confirm',
    bookingLink: 'Coming soon, please follow this link to book a car'
  },
  support: { supportTitle: 'How can we help you?' },
  drive: {
    driveTitle: 'Rental',
    rentalReference: 'Rental {{rental.reference}} {{rental.status}}',
    rentalStartAt: 'From {{start_at}}',
    rentalEndAt: 'to {{end_at}}',
    rentalLocation: '{{rental.location.name}}',
    rentalCar: '{{rental.car.reference}}',
    rentalCarModel:
      '{{rental.car.car_model.manufacturer}} {{rental.car.car_model.name}}',
    noRentalsTitle: 'No rentals',
    noRentalsDescription:
      'After booking, the actions below will be activated and will allow you to find the car, inspect it, start the rental contract and ultimately lock/unlock the vehicle',
    confirmCloseRentalConfirmationMessage:
      "You are about to end your rental contract.{{keyMessage}}\nThe car will then lock automatically so please ensure you don't leave any personal belongings in the car as you will not be able to open it once you press 'OK'.\nThank you.",
    confirmCloseRentalKeyMessageConfirmationMessage:
      '\nPLEASE PUT THE KEY BACK IN THE GLOVEBOX.',
    noKey: 'No key',
    notConnected: 'Not connected',
    connecting: '...Connecting...',
    locked: 'Doors locked',
    unlocked: 'Doors unlocked',
    noData: '...'
  },
  guide: {
    findTitle: 'Where is the car',
    returnTitle: 'How to return'
  },
  term: {
    rentalAgreementTitle: 'Sign the agreement',
    confirmContractDescription:
      'By signing, I certify that I have read and fully accepted the terms and conditions.',
    confirmContractTitle: "Enter '{{strKey}}' to confirm",
    confirmContractKeyString: 'I agree'
  },
  booking: {
    screenTitle: 'Book your car',
    subTitleStep1: 'BOOK',
    subTitleStep2: 'PAY & CONFIRM',
    subTitleStep3: 'DRIVE',
    locSectionTitle: 'LOCATION',
    carsSectionTitle: 'CARS',
    timeSectionTitle: 'PICK-UP & RETURN TIME',
    notFoundData: 'Data not found',
    infoLink: 'info',
    datesTooltip:
      'Enter your pick-up & return date here. You can also use the calendar view.\nNeed more help? ',
    tooltipLink: 'Contact us',
    dareSectionTitle: 'PICK-UP & RETURN DATE',
    totalPrice: 'TOTAL',
    stepBookNextTitle: 'FILL YOUR\nINFO',
    stepBookNextSubTitle: 'Go to step 2',
    calendarViewBtn: 'open calendar view',
    locationInfoTitle: 'LOCATION',
    carInfoTitle: 'CAR',
    priceInfoTitle: 'PRICE',
    priceInfoSubTitle: 'PRICE DESCRIPTION',
    infoRange: 'RANGE',
    infoPeople: 'PEOPLE',
    address: 'Address',
    seclectInfoBtn: 'SELECT THIS',
    unseclectInfoBtn: 'UNSELECT THIS',
    stepPayNextTitle: 'CONFIRM',
    stepPayNextSubTitle: 'Go to step 3',
    creditCardTitle: 'CREDIT CARD INFO',
    loyalityProgramtitle: 'VOUCHER & LOYALTY PROGRAM',
    infoAtPaymentTitle: 'BOOKING INFORMATION',
    totalPricePayment: 'TOTAL - ALL INCLUDED',
    voucherPlaceholder: 'Voucher / referral code',
    milesPlaceholder: 'Miles and more number',
    voucherTooltip:
      'Gain free credit and additional benefits by referring new customers. More information on https://www.ufodrive.com/en/ufo-world/referral',
    scanCreditCardBtn: 'Scan a new credit card',
    applyBtn: 'APPLY\nALTERNATIVE',
    pickUpAlt: 'Pickup',
    returnAlt: 'Return',
    noAvailableColor: 'no availability',
    highDemandColor: 'high demand',
    calendarColorsNotes: 'Select multiple dates to see discounts',
    driveTitle: 'Booking completed!',
    driveSubTitle: 'Enjoy your trip…',
    driveNextRegister: 'REGISTER',
    driveNextDrive: 'DRIVE YOUR CAR',
    dreveDescrRegisterP1:
      'Before the rental, please register by scanning your ID and driver licence. If you want to know more about how it works, ',
    dreveDescrDriveP1:
      'Find your bookings in the drive section of the app. If you want to know more about how it works, ',
    dreveDescrGuideLink: 'Please consult the FAQ.',
    feedBackTitle: 'Just one question',
    confirmDialog: 'DONE',
    feedBackInputPlaceholder: 'Your variant',
    ageConfirmation:
      'By confirming, I certify that I have read and fully accepted the general terms and conditions and that I am at least 26 years old and in possession of a valid driver license.',
    termsAlertBtn: 'Read terms',
    termsLinkLabel: 'Terms and conditions'
  },
  launch: {
    launchTitle: 'Fast track\ncar rental',
    slideOneTitle: 'The most advanced car rental',
    slideOneSubTitle: 'No key pick-up, no paperwork, no queues.',
    slideOneDescription:
      'This app will perform car inspection, activate your rental agreement and unlock your car',
    slideTwoTitle: 'No hidden charges',
    slideTwoSubTitle: 'No refuelling cost',
    slideTwoDescription:
      'Simple and transparent pricing: all-inclusive per day price. Fully comprehensive insurance included. No fuel costs, free recharging',
    slideThreeTitle: 'Sleek electric cars',
    slideThreeSubTitle: 'Zero emissions, just electric cars',
    slideThreeDescription:
      "ev technology brings together the best of design and technology to produce a driving experience that's out of this world",
    nextBtn: 'Reserve, Register and Drive',
    skipBtn: 'skip'
  },
  faceRecognizing: {
    incorrectDevicePosition: 'Please, hold phone upright',
    resetBtn: 'Reset',
    nextBtn: 'Next',
    backBtn: 'Back',
    saveBtnLabel: 'Save',
    validateBtnLabel: 'Validate',
    captureBtn: 'Capture',
    handlingDefaultError: 'Something went wrong. try again',
    handlingRentalError:
      "Identity wasn't validate, something went wrong, try again",
    registerCaptureDescription:
      'Please, capture your face to validate access in future',
    rentalCaptureDescription:
      'Please, capture your face to confirm your identity',
    incorrectFacePosition: 'Please, place your face in the center',
    incorrectFaceSize: 'Please, place your face closer to the camera',
    incorrectFaceYaw: "Please, don't turn away"
  },
  otaKeyNativeErrors
};

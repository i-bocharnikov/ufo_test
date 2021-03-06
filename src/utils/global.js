/* this theme settings are deprecated, use /theme instead */
import Color from 'color';
import { Dimensions, Platform } from 'react-native';

import configurations from './configurations';

const THEME_UFO = 'UFO';
const THEME_ACL = 'ACL';
const THEME = configurations.theme;

export const backgrounds = {
  HOME001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGDRIVE001.png')
      : require('../assets/images/background/ACLBGHOME001.png'),
  HOME002:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGHOME002.png')
      : require('../assets/images/background/ACLBGHOME002.png'),
  DRIVE001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGDRIVE001.png')
      : require('../assets/images/background/ACLBGDRIVE001.png'),
  FIND001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGFIND001.png')
      : require('../assets/images/background/ACLBGFIND001.png'),
  INSPECT001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGINSPECT001.png')
      : require('../assets/images/background/ACLBGINSPECT001.png'),
  RETURN001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGRETURN001.png')
      : require('../assets/images/background/ACLBGRETURN001.png'),
  SUPPORT001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGSUPPORT001.png')
      : require('../assets/images/background/ACLBGSUPPORT001.png'),
  REGISTER001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGREGISTER001.png')
      : require('../assets/images/background/ACLBGREGISTER001.png'),
  RESERVE001:
    THEME === THEME_UFO
      ? require('../assets/images/background/UFOBGRESERVE001.png')
      : require('../assets/images/background/ACLBGRESERVE001.png')
};

export const logos = {
  horizontal:
    THEME === THEME_UFO
      ? require('../assets/images/logos/UFOLOGO_H.png')
      : require('../assets/images/logos/ACLLOGO_H.png')
};

export const images = {
  photoPicker: require('./../assets/images/photo_picker.png'),
  shareRef: require('./../assets/images/share_ref.png'),
  captureCardIdFront: require('./../assets/images/scan/id-front.jpg'),
  captureCardIdBack: require('./../assets/images/scan/id-back.jpg'),
  driverCardFront: require('./../assets/images/scan/dl-front.jpg'),
  driverCardBack: require('./../assets/images/scan/dl-back.jpg')
};

export const dateFormats = {
  FULL: 'LLLL',
  DRIVE: 'dddd, MMM D - YYYY - hA'
};

export const colors = {
  // #0081B5
  TRANSITION_BACKGROUND: new Color.rgb(0, 0, 0),
  // #0081B5
  HEADER_BACKGROUND: new Color.rgb(39, 61, 76).alpha(0.85),
  // #172C32
  BACKGROUND: new Color.rgb(244, 245, 245),
  HEADER_TEXT: new Color.rgb(255, 255, 255),
  INVERTED_TEXT: new Color.rgb(255, 255, 255),
  TEXT: new Color.rgb(64, 101, 125),
  ICON: new Color.rgb(255, 255, 255),
  CARD_BACKGROUND: new Color.rgb(255, 255, 255).alpha(0.7),
  // #C8102E
  TODO: new Color.rgb(234, 80, 76),
  DONE: new Color.rgb(64, 101, 125),
  // #0081B5
  ACTIVE: new Color.rgb(64, 101, 125),
  PRIMARY: new Color.rgb(64, 101, 125),
  DISABLE: new Color.rgb(151, 151, 151),
  PENDING: new Color.rgb(151, 151, 151),
  ERROR: new Color.rgb(234, 80, 76),
  // #C8102E
  WARNING: new Color.rgb(255, 87, 34),
  WRONG: new Color('yellow'),
  INPUT_BG: new Color.rgb(255, 255, 255),
  // #2F2F2F
  TEXT_DARK: new Color.rgb(47, 47, 47),
  // #40B844
  SUCCESS: new Color.rgb(64, 184, 68)
};

export const navigationParams = {
  PREVIOUS_SCREEN: 'PREVIOUS_SCREEN',
  SUPPORT_FAQ_CATEGORY: 'SUPPORT_FAQ_CATEGORY',
  SUPPORT_FAQ: 'SUPPORT_FAQ'
};

class Screen {
  constructor(name, supportFaqCategory, backgroundImage) {
    this.name = name;
    this.supportFaqCategory = supportFaqCategory;
    this.backgroundImage = backgroundImage;
  }
  name = 'missing';
  supportFaqCategory = 'missing';
  backgroundImage = null;
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export const dims = {
  DEVICE_WIDTH: DEVICE_WIDTH,
  DEVICE_HEIGHT: DEVICE_HEIGHT,
  CONTENT_WIDTH: (DEVICE_WIDTH * 90) / 100,
  CONTENT_PADDING_HORIZONTAL: (DEVICE_WIDTH * 10) / 100 / 2,
  CONTENT_PADDING_TOP: DEVICE_HEIGHT / 8
};

export const screens = {
  HOME: new Screen('Drive', '', backgrounds.HOME002),
  REGISTER: new Screen('Register', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_OVERVIEW: new Screen('SignUp', 'REGISTER', backgrounds.DRIVE001),
  REGISTER_PHONE: new Screen('Phone', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_EMAIL: new Screen('Email', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_ADDRESS: new Screen('Address', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_IDENTIFICATION: new Screen('Identification', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_DRIVER_LICENCE: new Screen('DriverLicence', 'REGISTER', backgrounds.REGISTER001),
  REGISTER_MILES: new Screen('Miles', 'REGISTER', backgrounds.REGISTER001),
  DRIVE: new Screen('Drive', 'CAR', backgrounds.DRIVE001),
  FIND: new Screen('Find', 'FIND', backgrounds.FIND001),
  RETURN: new Screen('Return', 'RETURN', backgrounds.RETURN001),
  RENTAL_AGREEMENT: new Screen('RentalAgreement', 'TERM', backgrounds.DRIVE001),
  INSPECT: new Screen('Inspect', 'INSPECT', backgrounds.INSPECT001),
  INSPECT_LOCATE: new Screen('InspectLocateDamage', 'INSPECT', backgrounds.INSPECT001),
  INSPECT_CAPTURE: new Screen('InspectCaptureDamage', 'INSPECT', backgrounds.INSPECT001),
  INSPECT_COMMENT: new Screen('InspectCommentDamage', 'INSPECT', backgrounds.INSPECT001),
  SUPPORT_FAQS: new Screen('SupportFaqs', null, backgrounds.SUPPORT001),
  SUPPORT_FAQ: new Screen('SupportFaq', null, backgrounds.SUPPORT001),
  SUPPORT_CHAT: new Screen('SupportChat', null, backgrounds.SUPPORT001)
};

class Size {
  constructor(name, fontSize) {
    this.name = name;
    this.fontSize = fontSize;
  }
  name = 'massive';
  fontSize = 256;
}

export const sizes = {
  MINI: new Size('mini', 4),
  TINY: new Size('tiny', 8),
  SMALL: new Size('small', 16),
  LARGE: new Size('large', 32),
  BIG: new Size('big', 64),
  HUGE: new Size('huge', 128),
  MASSIVE: new Size('massive', 256)
};

class ActionStyle {
  constructor(name, color, elevation) {
    this.name = name;
    this.color = color;
    this.elevation = elevation;
  }
  name = 'wrong';
  color = colors.WRONG;
  elevation = 0;
}

export const actionStyles = {
  TODO: new ActionStyle('todo', colors.TODO, 3),
  DONE: new ActionStyle('done', colors.DONE, 2),
  ACTIVE: new ActionStyle('active', colors.ACTIVE, 1),
  DISABLE: new ActionStyle('disable', colors.DISABLE, 0),
  SUCCESS: new ActionStyle('success', colors.SUCCESS, 2),
  ERROR: new ActionStyle('error', colors.ERROR, 3),
  PENDIBNG: new ActionStyle('pending', colors.PENDING, 0),
  WRONG: new ActionStyle('wrong', colors.WRONG, 0)
};

class Icon {
  constructor(name, i18nKey) {
    this.name = name;
    this.i18nKey = i18nKey;
  }
  name = 'bonfire';
  i18nKey = 'missing';
}

export const icons = {
  RESERVE: new Icon('add', 'icon:reserve'),
  REGISTER: new Icon('person', 'icon:register'),
  MY_DETAILS: new Icon('person', 'icon:myDetails'),
  DRIVE: new Icon('speedometer', 'icon:drive'),
  FIND: new Icon('search', 'icon:find'),
  FOUND: new Icon('locate', 'icon:found'),
  RETURN: new Icon('flag', 'icon:return'),
  WHERE: new Icon('locate', 'icon:where'),
  INSPECT: new Icon('checkbox-outline', 'icon:inspect'),
  RENTAL_AGREEMENT: new Icon('create', 'icon:rentalAgreement'),
  BACK: new Icon('arrow-round-back', 'icon:back'),
  NEXT: new Icon('arrow-round-forward', 'icon:next'),
  SLIDE_PREVIOUS: new Icon('arrow-dropleft', 'icon:slidePrevious'),
  SLIDE_NEXT: new Icon('arrow-dropright', 'icon:slideNext'),
  HOME: new Icon('home', 'icon:home'),
  CONTINUE_LATER: new Icon('home', 'icon:continueLater'),
  PAY: new Icon('card', 'icon:pay'),
  LOGIN: new Icon('log-in', 'icon:login'),
  LOGOUT: new Icon('log-out', 'icon:logout'),
  RESEND_CODE: new Icon('refresh', 'icon:resendCode'),
  HELP: new Icon('help', 'icon:help'),
  WIFI: new Icon('wifi', 'icon:wifi'),
  BLUETOOTH: new Icon('bluetooth', 'icon:bluetooth'),
  PHONE: new Icon('phone-portrait', 'icon:phone'),
  EMAIL: new Icon('mail', 'icon:email'),
  ADDRESS: new Icon('locate', 'icon:address'),
  IDENTIFICATION: new Icon('contact', 'icon:identification'),
  DRIVER_LICENCE: new Icon('document', 'icon:driverLicence'),
  SELECT: new Icon('play', 'icon:select'),
  CAPTURE: new Icon('camera', 'icon:capture'),
  NEW_CAPTURE: new Icon('camera', 'icon:newCapture'),
  TORCH: new Icon('flash', 'icon:torch'),
  VALIDATE: new Icon('checkmark', 'icon:validate'),
  DONE: new Icon('checkmark', 'icon:done'),
  CANCEL: new Icon('close', 'icon:cancel'),
  SAVE: new Icon('checkmark', 'icon:save'),
  REDO: new Icon('repeat', 'icon:redo'),
  SKIP: new Icon('skip-forward', 'icon:skip'),
  SEGMENT_OPEN: new Icon('arrow-dropdown', 'icon:segmentOpen'),
  SEGMENT_CLOSE: new Icon('arrow-dropright', 'icon: segmentClose'),
  CHAT: new Icon('chatbubbles', 'icon:chat'),
  ADD: new Icon('add', 'icon:add'),
  SIGN: new Icon('finger-print', 'icon:sign'),
  CLOSE_RENTAL: new Icon('flag', 'icon:closeRental'),
  BROWSE: new Icon('browsers', 'icon:browse'),
  CLIPBOARD: new Icon('clipboard', 'icon:clipboard'),
  MAP: new Icon('map', 'icon:find'),

  UNLOCK: new Icon('unlock', 'icon:unlock'),
  LOCK: new Icon('lock', 'icon:lock'),
  START: new Icon('pulse', 'icon:start'),
  STOP: new Icon('remove', 'icon:stop'),
  KEY: new Icon('key', 'icon:key'),
  CONNECT: new Icon('bluetooth', 'icon:connect'),

  EMERGENCY_CALL: new Icon('call', 'icon:emergencyCall'),
  WRONG: new Icon('bonfire', 'icon:wrong')
};

export class UFOError extends Error {
  constructor(key) {
    super(key);
    this.i18nKey = key || 'error:missing';
    this.i18nValue = {};
  }
}

export const errors = {
  INTERNET_CONNECTION_REQUIRED: new UFOError('error:internetConnectionRequired'),
  BLUETOOTH_CONNECTION_REQUIRED: new UFOError('error:bluetoothConnectionRequired'),
  UNEXPECTED_SERVER_REPONSE: new UFOError('error:unexpectedServerResponse')
};

export const fonts = {
  /* deprecated, use textTheme from theme instead */
  REGULAR: Platform.OS === 'android' ? 'SofiaProRegular' : 'Sofia Pro',
  LIGHT: Platform.OS === 'android' ? 'SofiaProLight' : 'Sofia Pro',
  BOLD: Platform.OS === 'android' ? 'SofiaProBold' : 'Sofia Pro'
};

import Color from 'color'


//https://github.com/jondot/awesome-react-native#geolocation


//https://github.com/zhangtaii/react-native-google-place-picker
//TODO https://github.com/leecade/react-native-swiper
//https://reactnativeexample.com/react-native-range-datepicker-inspired-by-airbnb/
//https://github.com/monterosalondon/react-native-parallax-scroll
//https://github.com/Tinysymphony/react-native-calendar-select
//https://github.com/anvilabs/react-native-image-carousel
//https://github.com/xcarpentier/react-native-stripe-api
//https://github.com/doefler/react-native-social-share
//https://github.com/bamlab/react-native-image-resizer
//https://github.com/naoufal/react-native-touch-id
//https://github.com/oblador/react-native-keychain

export const colors = {
    HEADER_BACKGROUND: new Color('#0081B5'),
    BACKGROUND: new Color('#172c32'),
    TEXT: new Color('#fff'),
    TODO: new Color('#c51162'),
    DONE: new Color('#03DAC6'),
    ACTIVE: new Color('#0081B5'),
    PRIMARY: new Color('#0081B5'),
    DISABLE: new Color('#808080'),
    PENDING: new Color('#616161'),
    SUCCESS: new Color('#03DAC6'),
    ERROR: new Color('#C8102E'),
    WARNING: new Color.rgb(255, 87, 34),
    WRONG: new Color('yellow'),
}

export const screens = {
    HOME: 'Home',
    RESERVE: 'Reserve',
    RESERVE_LOCATION: 'Location',
    RESERVE_DATE_AND_CAR: 'DateAndCar',
    RESERVE_PAYMENT: 'Payment',
    REGISTER: 'Register',
    REGISTER_OVERVIEW: 'Overview',
    REGISTER_PHONE: 'Phone',
    REGISTER_EMAIL: 'Email',
    REGISTER_ADDRESS: 'Address',
    REGISTER_IDENTIFICATION: 'Identification',
    REGISTER_DRIVER_LICENCE: 'DriverLicence',
    DRIVE: 'Drive',
    SUPPORT: 'Support',
}

class Size {

    constructor(name, fontSize) {
        this.name = name;
        this.fontSize = fontSize;
    }
    name = "massive"
    fontSize = 256
}

export const sizes = {
    MINI: new Size('mini', 4),
    TINY: new Size('tiny', 8),
    SMALL: new Size('small', 16),
    LARGE: new Size('large', 32),
    BIG: new Size('big', 64),
    HUGE: new Size('huge', 128),
    MASSIVE: new Size('massive', 256),
}

class Style {

    constructor(name, color, elevation) {
        this.name = name;
        this.color = color;
        this.elevation = elevation
    }
    name = "wrong"
    color = colors.WRONG
    elevation = 0
}

export const styles = {
    TODO: new Style('todo', colors.TODO, 3),
    DONE: new Style('done', colors.DONE, 2),
    ACTIVE: new Style('active', colors.ACTIVE, 1),
    DISABLE: new Style('disable', colors.DISABLE, 0),
    SUCCESS: new Style('success', colors.SUCCESS, 2),
    ERROR: new Style('error', colors.ERROR, 3),
    PENDIBNG: new Style('pending', colors.PENDING, 0),
    WRONG: new Style('wrong', colors.WRONG, 0),
}

class Icon {

    constructor(name, i18nKey) {
        this.name = name;
        this.i18nKey = i18nKey;
    }
    name = "bonfire"
    i18nKey = "missing"
}

export const icons = {
    RESERVE: new Icon('add', 'icon:reserve'),
    REGISTER: new Icon('person', 'icon:register'),
    DRIVE: new Icon('car', 'icon:drive'),
    BACK: new Icon('arrow-round-back', 'icon:back'),
    NEXT: new Icon('arrow-round-forward', 'icon:next'),
    HOME: new Icon('home', 'icon:home'),
    PAY: new Icon('card', 'icon:pay'),
    CONNECT: new Icon('log-in', 'icon:connect'),
    DISCONNECT: new Icon('log-out', 'icon:disconnect'),
    REQUEST_CODE: new Icon('key', 'icon:requestCode'),
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
    TORCH: new Icon('flashlight', 'icon:torch'),
    VALIDATE: new Icon('checkmark', 'icon:validate'),
    CANCEL: new Icon('close', 'icon:cancel'),
    SAVE: new Icon('checkmark', 'icon:save'),
    REDO: new Icon('redo', 'icon:redo'),
    SKIP: new Icon('skip-forward', 'icon:skip'),
    WRONG: new Icon('bomfire', 'icon:wrong')
}



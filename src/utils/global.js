import Color from 'color'

export const colors = {
    HEADER_BACKGROUND: new Color('#0081B5'),
    BACKGROUND: new Color('#172c32'),
    TEXT: new Color('#fff'),
    TODO: new Color('#c51162'),
    DONE: new Color('#03DAC6'),
    ACTIVE: new Color('#0081B5'),
    PRIMARY: new Color('#0081B5'),
    DISABLE: new Color('#808080'),
    PENDING: new Color('#018786'),
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
    WRONG: new Icon('bomfire', 'icon:wrong')
}



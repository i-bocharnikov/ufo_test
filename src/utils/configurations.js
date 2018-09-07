import packageJson from "../../package.json";

const localhost = "192.168.1.107"

const development = {
    UFO_APP_USAGE: "LOCAL",
    UFO_APP_NAME: packageJson.name,
    UFO_APP_VERSION: packageJson.version,
    UFO_APP_BUILD_NUMBER: "002",
    UFO_SERVER_API_URL: "http://" + localhost + ":1337/ufodrive/1.0.0/",
    UFO_SERVER_API_BASE_URL: "http://" + localhost + ":1337",
    UFO_SERVER_API_VERSION: "v1",
    UFO_ANALYTICS_ACTIVE: false,
    UFO_ANALYTICS_API_URL: "http://localhost",
    UFO_ANALYTICS_API_KEY: "dea07cb44f774bf6fa2593f63bc4e87b30007f95",
    UFO_PAYMENT_API_KEY: "pk_test_Qit7OdMoQNfWaOr04F0hC29E"
};

const uat = {
    APP_USAGE: "UAT",
    UFO_APP_NAME: packageJson.name,
    UFO_APP_VERSION: packageJson.version,
    UFO_APP_BUILD_NUMBER: "002",
    UFO_SERVER_API_URL: "https://back.ufodrive.com/ufodrive/1.0.0/",
    UFO_SERVER_API_BASE_URL: "https://back.ufodrive.com/",
    UFO_SERVER_API_VERSION: "v1",
    UFO_ANALYTICS_ACTIVE: false,
    UFO_ANALYTICS_API_URL: "http://localhost",
    UFO_ANALYTICS_API_KEY: "dea07cb44f774bf6fa2593f63bc4e87b30007f95",
    UFO_PAYMENT_API_KEY: "pk_test_Qit7OdMoQNfWaOr04F0hC29E"
};

const production = {
    APP_USAGE: "PRODUCTION",
    UFO_APP_NAME: packageJson.name,
    UFO_APP_VERSION: packageJson.version,
    UFO_APP_BUILD_NUMBER: "001",
    UFO_SERVER_API_URL: "https://back.ufodrive.com/ufodrive/1.0.0/",
    UFO_SERVER_API_BASE_URL: "https://back.ufodrive.com/",
    UFO_SERVER_API_VERSION: "v1",
    UFO_ANALYTICS_ACTIVE: true,
    UFO_ANALYTICS_API_URL: "https://back.ufodrive.com/countly/",
    UFO_ANALYTICS_API_KEY: "ec0ea95fdc0b1b180435e02466c75377dd0f3569",
    UFO_PAYMENT_API_KEY: "pk_live_oi9sZTmKXYxcHmWzV7UMLboa"
};

const configurations = development;

export default configurations;

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n'; // initialized i18next instance

const DriverApp = () => (
    <I18nextProvider i18n={i18n}>
        <App />
    </I18nextProvider>
);

AppRegistry.registerComponent('driverApp', () => DriverApp);



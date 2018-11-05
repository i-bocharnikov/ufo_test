import React from 'react';
import { AppRegistry } from 'react-native';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import i18n from './utils/i18n';

const DriverApp = () => (
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);

AppRegistry.registerComponent('driverApp', () => DriverApp);

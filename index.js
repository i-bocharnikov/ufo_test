import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './src/store/configureStore';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/utils/i18n'; // initialized i18next instance

const store = configureStore();

const RNRedux = () => (
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <App />
        </I18nextProvider>
    </Provider>
);

AppRegistry.registerComponent('driverApp', () => RNRedux);
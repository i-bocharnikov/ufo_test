import React, { Component } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    YellowBox,
} from 'react-native';
import {
    setJSExceptionHandler,
    setNativeExceptionHandler,
} from 'react-native-exception-handler';
import i18n from 'i18next';

import logger, { codeTypes, severityTypes } from './utils/userActionsLogger';
import RootStack from './navigators/RootNavigator';
import { colors } from './utils/theme';
/* deprecated for using, will remove later */
import { StyleProvider } from 'native-base';
import getTheme from './../native-base-theme/components';

/* Handling some errors */
YellowBox.ignoreWarnings(['Module RNI18n requires main queue setup']);

const errorHandler = (error, isFatal) => {
    if (isFatal) {
        const message = i18n.t('error:jsExceptionFatal');
        logger(
            severityTypes.ERROR,
            codeTypes.ERROR,
            '',
            message,
            JSON.stringify(error)
        );

        Alert.alert(
            message,
            `${i18n.t('error:jsExceptionFatalReport')}\n\n${i18n.t(
                'error:error'
            )}: ${error.name}\n${error.message}`,
            [{ text: i18n.t('common:closeBtn') }]
        );
    } else {
        const message = i18n.t('error:jsException');
        logger(
            severityTypes.WARN,
            codeTypes.ERROR,
            'uncatch js error',
            message,
            JSON.stringify(error)
        );
    }
};

// set true to second arg to use errorHandler in dev mode
setJSExceptionHandler(errorHandler);

setNativeExceptionHandler(exceptionStr => {
    const message = i18n.t('error:nativeException');
    logger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'uncatch native error',
        message,
        exceptionStr
    );
});

/* Root App component */
const styles = StyleSheet.create({
    appWrapper: {
        flex: 1,
        backgroundColor: colors.BG_TRANSITION_COLOR,
    },
});

export default class App extends Component {
    render() {
        return (
            <SafeAreaView style={styles.appWrapper}>
                <StatusBar
                    backgroundColor={colors.BG_TRANSITION_COLOR}
                    barStyle="light-content"
                />
                <StyleProvider style={getTheme()}>
                    <RootStack />
                </StyleProvider>
            </SafeAreaView>
        );
    }
}

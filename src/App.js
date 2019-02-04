import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  YellowBox,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import i18n from 'i18next';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';

import appStore from './stores/appStore';
import RootStack from './navigators/RootNavigator';
import { colors, images } from './utils/theme';
import remoteLoggerService from './utils/remoteLoggerService';
/* deprecated for using, will remove later */
import { StyleProvider } from 'native-base';
import getTheme from './../native-base-theme/components';

/* Handling some errors */
YellowBox.ignoreWarnings(['Module RNI18n requires main queue setup']);

const errorHandler = (error, isFatal) => {
  if (isFatal) {
    const message = i18n.t('error:jsExceptionFatal');
    remoteLoggerService
      .error(
        'errorHandler',
        'Fatal Javascript Exception',
        { root: `${error.name} : ${error.message}` },
        error
      )
      .catch(error => {});

    Alert.alert(message, `${i18n.t('error:jsExceptionFatalReport')}`, [
      { text: i18n.t('common:closeBtn') }
    ]);
  } else {
    const message = i18n.t('error:jsException');
    remoteLoggerService
      .warn(
        'errorHandler',
        'Non Fatal Javascript Exception',
        { root: `${error.name} : ${error.message}` },
        error
      )
      .catch(error => {});
  }
};

// set true to second arg to use errorHandler in dev mode
setJSExceptionHandler(errorHandler);

setNativeExceptionHandler(exceptionStr => {
  const message = i18n.t('error:nativeException');
  remoteLoggerService
    .error('NativeExceptionHandler', 'Fatal Native Exception', {
      message: exceptionStr
    })
    .catch(error => {});
});

/* Root App component */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: colors.BG_TRANSITION_COLOR
  },
  imageMask: {
    position: 'absolute',
    top: 0 - STATUS_BAR_HEIGHT / 2,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignSelf: 'center'
  }
});

@observer
class App extends Component {
  @observable animationDone = false;
  loadingProgress = new Animated.Value(0);

  async componentDidMount() {
    reaction(
      () => appStore.isAppReady,
      () => appStore.isAppReady && this.startMaskAnimation()
    );
  }

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
        {!this.animationDone && (
          <Animated.Image
            source={images.BG_LAUNCH}
            style={[ styles.imageMask, this.imageAnimatedStyles ]}
          />
        )}
      </SafeAreaView>
    );
  }

  get imageAnimatedStyles() {
    return {
      transform: [
        {
          scale: this.loadingProgress.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 32]
          })
        }
      ],
      opacity: this.loadingProgress.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [1, 0.8, 0]
      })
    };
  }

  startMaskAnimation = () => Animated.timing(
    this.loadingProgress,
    {
      useNativeDriver: true,
      toValue: 100,
      duration: 1200,
      easing: Easing.ease
    }
  ).start(() => ( this.animationDone = false ));
}

export default App;

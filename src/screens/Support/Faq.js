import React, { Component } from 'react';
import { WebView, Text, View, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import Hyperlink from 'react-native-hyperlink';

import { UFOLoader, UFOContainer } from './../../components/common';
import styles from './styles';

const FAQ_WEB_URL = 'https://www.ufodrive.com/en/contact/faq';

@observer
class FaqScreen extends Component {
  @observable isFocused = true;

  /* when tab more than 'delayBeforeBlur' ms is unfocused - remove webview from render */
  delayBeforeBlur = 5000;
  timerBlur = null;
  didFocusListener = null;
  didBlurListener = null;

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.didBlurListener = this.props.navigation.addListener('didBlur', this.onScreenBlur);
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

  render() {
    return (
      <UFOContainer style={styles.container}>
        {this.isFocused && (
          <WebView
            source={{ uri: FAQ_WEB_URL }}
            useWebKit={true}
            style={styles.webView}
            renderError={this.renderError}
            startInLoadingState={true}
            renderLoading={this.renderLoading}
          />
        )}
      </UFOContainer>
    );
  }

  renderError = () => (
    <View style={styles.webviewErrorWrapper}>
      <Hyperlink linkDefault={true} linkStyle={styles.textUrl}>
        <Text style={styles.webviewError}>
          {this.props.t('webViewFaqError')}{FAQ_WEB_URL}
        </Text>
      </Hyperlink>
    </View>
  );

  renderLoading = () => (
    <UFOLoader
      isVisible={true}
      isModal={false}
      {...Platform.select({ ios: { color: 'rgba(0,0,0,0.6)' } })}
    />
  );

  onScreenFocus = () => {
    clearTimeout(this.timerBlur);
    this.isFocused = true;
  };

  onScreenBlur = () => {
    this.timerBlur = setTimeout(() => { this.isFocused = false; }, this.delayBeforeBlur);
  };
}

export default translate('support')(FaqScreen);

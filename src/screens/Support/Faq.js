import React, { Component } from 'react';
import { WebView, Text, View, Platform } from 'react-native';
import { translate } from 'react-i18next';
import Hyperlink from 'react-native-hyperlink';

import { UFOLoader, UFOContainer } from './../../components/common';
import styles from './styles';

const FAQ_WEB_URL = 'https://www.ufodrive.com/en/contact/faq';

class FaqScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <WebView
          source={{ uri: FAQ_WEB_URL }}
          useWebKit={true}
          style={styles.webView}
          renderError={this.renderError}
          startInLoadingState={true}
          renderLoading={this.renderLoading}
        />
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
}

export default translate('support')(FaqScreen);

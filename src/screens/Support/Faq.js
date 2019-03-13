import React, { Component } from 'react';
import { WebView, Text, Platform } from 'react-native';
import { translate } from 'react-i18next';
import Hyperlink from 'react-native-hyperlink';

import { UFOLoader } from './../../components/common';
import styles from './styles';

const FAQ_WEB_URL = 'https://www.ufodrive.com/en/contact/faq';

class FaqScreen extends Component {
  render() {
    return (
      <WebView
        source={{ uri: FAQ_WEB_URL }}
        renderError={this.renderError}
        startInLoadingState={true}
        renderLoading={this.renderLoading}
        useWebKit={true}
      />
    );
  }

  renderError = () => (
    <Hyperlink linkDefault={true} linkStyle={styles.textUrl}>
      <Text style={styles.webviewError}>
        {this.props.t('webViewError')}{FAQ_WEB_URL}
      </Text>
    </Hyperlink>
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

import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import Icon from 'react-native-vector-icons/Entypo';

import { keys as screenKeys } from './../../navigators/helpers';
import UFONavBarWrapper from './../../components/header/UFONavBarWrapper';
import { UFOContainer, UFOIcon } from './../../components/common';
import styles from './styles';

class Step1BookScreen extends Component {
  getSubTitleComponent() {
    const t = this.props.t;

    return (
      <Fragment>
        <Text style={styles.headerSubtitleLabel}>
          1. {t('booking:subTitleStep1')}
        </Text>
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <Icon
          name="chevron-thin-right"
          style={[styles.headerSubtitleIcon, styles.headerFutureStep]}
        />
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <Text style={[styles.headerSubtitleLabel, styles.headerFutureStep]}>
          2. {t('booking:subTitleStep2')}
        </Text>
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <Icon
          name="chevron-thin-right"
          style={[styles.headerSubtitleIcon, styles.headerFutureStep]}
        />
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <Text style={[styles.headerSubtitleLabel, styles.headerFutureStep]}>
          3. {t('booking:subTitleStep3')}
        </Text>
      </Fragment>
    );
  }

  render() {
    const { t } = this.props;

    const testContent = new Array(20).fill(null).map((item, i) => (
      <Text key={i} style={{height: 50}}>Item {i}</Text>
    ));

    return (
      <UFONavBarWrapper
        title={t('booking:screenTitle')}
        subtitleComponent={this.getSubTitleComponent()}
      >
        {testContent}
      </UFONavBarWrapper>
    );
  }
}

export default translate()(Step1BookScreen);

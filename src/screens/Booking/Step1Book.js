import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import { keys as screenKeys } from './../../navigators/helpers';
import UFONavBarWrapper from './../../components/header/UFONavBarWrapper';
import { UFOContainer, UFOIcon_next } from './../../components/common';
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
        <UFOIcon_next
          name="chevron-thin-right"
          iconPack="Entypo"
          style={[styles.headerSubtitleIcon, styles.headerFutureStep]}
        />
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <Text style={[styles.headerSubtitleLabel, styles.headerFutureStep]}>
          2. {t('booking:subTitleStep2')}
        </Text>
        <Text style={styles.headerSubtitleSpaces}>{' '}</Text>
        <UFOIcon_next
          name="chevron-thin-right"
          iconPack="Entypo"
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
        backBtnAction={this.navBack}
      >
        {testContent}
      </UFONavBarWrapper>
    );
  }

  navBack = () => {
    this.props.navigation.navigate(screenKeys.Home)
  };
}

export default translate()(Step1BookScreen);

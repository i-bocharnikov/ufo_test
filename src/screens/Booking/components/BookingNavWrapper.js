import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { keys as screenKeys } from './../../../navigators/helpers';
import UFONavBarWrapper from './../../../components/header/UFONavBarWrapper';
import { UFOIcon_next } from './../../../components/common';
import styles from './../styles';
import navBarStyles from './../../../components/header/styles/navBarStyles';

class BookingNavWrapper extends Component {
  render() {
    const { t, navBack, BottomActionPanel } = this.props;

    return (
      <View style={[styles.wrapper, BottomActionPanel && styles.wrapperBottomPadding]}>
        <UFONavBarWrapper
          title={t('booking:screenTitle')}
          SubtitleComponent={this.getSubTitleComponent()}
          backBtnAction={navBack}
        >
          {this.props.children}
        </UFONavBarWrapper>
        {BottomActionPanel}
      </View>
    );
  }

  getSubTitleComponent = () => {
    const { t, currentStep } = this.props;

    return (
      <View style={styles.subTitleWrapper}>
        <Text style={[
          navBarStyles.subTitle,
          styles.headerSubtitleLabel
        ]}>
          1. {t('booking:subTitleStep1')}
        </Text>
        <UFOIcon_next
          name="chevron-thin-right"
          iconPack="Entypo"
          style={[
            navBarStyles.subTitle,,
            styles.headerSubtitleIcon,
            currentStep < 2 && styles.headerFutureStep
          ]}
        />
        <Text style={[
          navBarStyles.subTitle,
          styles.headerSubtitleLabel,
          currentStep < 2 && styles.headerFutureStep
        ]}>
          2. {t('booking:subTitleStep2')}
        </Text>
        <UFOIcon_next
          name="chevron-thin-right"
          iconPack="Entypo"
          style={[
            navBarStyles.subTitle,
            styles.headerSubtitleIcon,
            currentStep < 3 && styles.headerFutureStep
          ]}
        />
        <Text style={[
          navBarStyles.subTitle,
          styles.headerSubtitleLabel,
          currentStep < 3 && styles.headerFutureStep
        ]}>
          3. {t('booking:subTitleStep3')}
        </Text>
      </View>
    );
  };
}

BookingNavWrapper.propTypes = {
  navBack: PropTypes.func,
  currentStep: PropTypes.number,
  BottomActionPanel: PropTypes.node
};

export default translate()(BookingNavWrapper);

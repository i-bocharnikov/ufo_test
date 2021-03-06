import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import UFONavBarWrapper from './../../../components/header/UFONavBarWrapper';
import { UFOIcon } from './../../../components/common';
import styles from './../styles';
import navBarStyles from './../../../components/header/styles/navBarStyles';

class BookingNavWrapper extends Component {
  render() {
    const { t, navBack, navToFaq, BottomActionPanel, isEditing } = this.props;

    return (
      <View style={[ styles.screenWrapper, BottomActionPanel && styles.wrapperBottomPadding ]}>
        <UFONavBarWrapper
          title={t(isEditing ? 'screenTitleEdit' : 'screenTitle')}
          SubtitleComponent={this.getSubTitleComponent()}
          leftBtnAction={navBack}
          rightBtnAction={navToFaq}
          ref={ref => (this.navBarWrapper = ref)}
        >
          {this.props.children}
        </UFONavBarWrapper>
        {BottomActionPanel}
      </View>
    );
  }

  getSubTitleComponent = () => {
    const { t, currentStep, navToFirstStep, isEditing, isCancellation } = this.props;

    return (
      <Fragment>
        <Text
          onPress={navToFirstStep}
          style={[
            navBarStyles.subTitle,
            styles.headerSubtitleLabel,
            currentStep > 1 && styles.headerPastStep
          ]}
        >
          1. {t(isEditing ? 'subTitleStep1Upgrade' : 'subTitleStep1')}
        </Text>
        <UFOIcon
          name="chevron-thin-right"
          iconPack="Entypo"
          style={[
            navBarStyles.subTitle,
            styles.headerSubtitleIcon,
            currentStep < 2 && styles.headerFutureStep
          ]}
        />
        <Text style={[
          navBarStyles.subTitle,
          styles.headerSubtitleLabel,
          currentStep < 2 && styles.headerFutureStep,
          currentStep > 2 && styles.headerPastStep
        ]}
        >
          2. {t('subTitleStep2')}
        </Text>
        <UFOIcon
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
        ]}
        >
          3. {t(isCancellation ? 'subTitleStep3Cancel' : 'subTitleStep3')}
        </Text>
      </Fragment>
    );
  };

  scrollToTop = () => {
    if (this.navBarWrapper) {
      this.navBarWrapper.scrollToTop();
    }
  };
}

BookingNavWrapper.propTypes = {
  navBack: PropTypes.func,
  navToFaq: PropTypes.func,
  navToFirstStep: PropTypes.func,
  currentStep: PropTypes.number,
  BottomActionPanel: PropTypes.node,
  isEditing: PropTypes.bool,
  isCancellation: PropTypes.bool
};

export default translate('booking', { withRef: true })(BookingNavWrapper);

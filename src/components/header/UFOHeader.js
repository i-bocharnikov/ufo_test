import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { UFOText, UFOImage } from './../common';
import { colors, icons, actionStyles, screens, sizes, logos } from './../../utils/global';
import UFOAction from './../UFOAction';
import { activitiesStore } from './../../stores';
import styles from './styles';

@observer
export default class UFOHeader extends Component {
  render() {
    const { t, transparent, title, logo, currentScreen = screens.HOME } = this.props;

    const titleComponent = title ? (
      <UFOText inverted h3>
        {title}
      </UFOText>
    ) : null;
    const logoComponent = logo ? (
      <UFOImage source={logos.horizontal} style={styles.logo} resizeMode="contain" />
    ) : null;

    const alpha = transparent ? 0 : 0.7;
    const activities = activitiesStore.activities;
    let activitiesMessage = null;

    if (activities.internetAccessFailure && activities.bluetoothAccessFailure) {
      activitiesMessage = t('activities:internetbluetoothAccessFailure');
    } else if (activities.internetAccessFailure) {
      activitiesMessage = t('activities:internetAccessFailure');
    } else if (activities.bluetoothAccessFailure) {
      activitiesMessage = t('activities:bluetoothAccessFailure');
    }

    return (
      <View style={styles.headerMasterContainer}>
        {activitiesMessage && (
          <View style={styles.activityMessages}>
            <UFOText h11 inverted center>
              {activitiesMessage}
            </UFOText>
          </View>
        )}
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: colors.HEADER_BACKGROUND.alpha(alpha).string() }
          ]}
        >
          <View style={styles.left}>
            {this.renderLeftAction()}
          </View>
          <View style={styles.body}>
            {titleComponent}
            {logoComponent}
          </View>
          <View style={styles.right}>
            {this.renderRightAction()}
          </View>
        </View>
      </View>
    );
  }

  renderLeftAction = () => {
    const { leftAction } = this.props;
    const defaultAction = {
      style: actionStyles.ACTIVE,
      icon: icons.HOME,
      onPress: this.goToHome
    };

    return (
      <UFOAction
        action={leftAction || defaultAction}
        size={sizes.SMALL}
        noText
      />
    );
  };

  renderRightAction = () => {
    const { rightAction, currentScreen = screens.HOME  } = this.props;
    const isSupport = currentScreen.supportFaqCategory !== null;
    const defaultAction = {
      style: actionStyles.TODO,
      icon: icons.HELP,
      onPress: () => this.goToSupport(currentScreen)
    };

    return (isSupport || rightAction) && (
      <UFOAction
        action={rightAction || defaultAction}
        size={sizes.SMALL}
        noText
      />
    );
  };

  goToHome = () => {
    this.props.navigation.navigate(screens.HOME.name);
  };

  goToSupport = currentScreen => {
    this.props.navigation.navigate(screens.SUPPORT_FAQS.name, {
      SUPPORT_FAQ_CATEGORY: currentScreen.supportFaqCategory,
      PREVIOUS_SCREEN: currentScreen
    });
  };
}

UFOHeader.propTypes = {
  t: PropTypes.func.isRequired,
  transparent: PropTypes.bool,
  title: PropTypes.string,
  logo: PropTypes.bool,
  currentScreen: PropTypes.object,
  leftAction: PropTypes.object,
  rightAction: PropTypes.object
};

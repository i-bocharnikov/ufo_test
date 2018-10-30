import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { UFOText, UFOIcon } from './common';
import { actionStyles, colors, icons, sizes } from './../utils/global';

const styles = StyleSheet.create({
  area: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

class UFOAction extends Component {
  render() {
    const {
      t,
      noText,
      activityPending,
      action = {},
      inverted = false,
      size = sizes.LARGE,
    } = this.props;

    const style = activityPending
      ? actionStyles.DISABLE
        : action.style
        ? action.style
      : actionStyles.WRONG;

    const color = activityPending
      ? colors.DISABLE
        : style.color
        ? style.color
      : colors.WRONG;

    const elevation = style.elevation ||
      style === actionStyles.TODO
        ? 4
        : style === actionStyles.ACTIVE
          ? 3
          : style === actionStyles.DONE
            ? 2
            : style === actionStyles.DISABLE
              ? 0
              : 0;

    const icon = action.icon ? action.icon : icons.WRONG;
    const actionSize = size === sizes.SMALL ? 30 : 45;

    return (
      <View style={styles.area}>
        <Touchable
          foreground={Touchable.Ripple(colors.DONE.string(), true)}
          style={[styles.button, {
            backgroundColor: color.string(),
            elevation: elevation,
            width: actionSize,
            height: actionSize,
            borderRadius: actionSize,
          }]}
          onPress={action.onPress}
          disabled={style === actionStyles.DISABLE}
        >
          <UFOIcon icon={icon} size={size} />
        </Touchable>
        {!noText && (
          <UFOText h10 upper inverted={!inverted}>
            {t(icon.i18nKey)}
          </UFOText>
        )}
      </View>
    );
  }
}

UFOAction.propTypes = {
  actions: PropTypes.object,
  activityPending: PropTypes.bool,
  inverted: PropTypes.bool,
  noText: PropTypes.bool,
  size: PropTypes.object
};

export default translate('translations')(UFOAction);
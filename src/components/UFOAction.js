import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { UFOText, UFOIcon_old } from './common';
import { actionStyles, colors, icons, sizes } from './../utils/global';

const styles = StyleSheet.create({
  area: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class UFOAction extends Component {
  render() {
    const {
      t,
      noText,
      activityPending,
      action = {},
      inverted = false,
      size = sizes.LARGE
    } = this.props;

    const style = activityPending ? actionStyles.DISABLE : (action.style || actionStyles.WRONG);
    const color = activityPending ? colors.DISABLE : (style.color || colors.WRONG);
    const elevation = this.getElevation(style);
    const icon = action.icon ? action.icon : icons.WRONG;
    const actionSize = size === sizes.SMALL ? 30 : 45;

    return (
      <View style={styles.area}>
        <Touchable
          foreground={Touchable.Ripple(colors.DONE.string(), true)}
          style={[ styles.button, {
            backgroundColor: color.string(),
            elevation: elevation,
            width: actionSize,
            height: actionSize,
            borderRadius: actionSize
          }]}
          onPress={action.onPress}
          disabled={style === actionStyles.DISABLE}
        >
          <UFOIcon_old
            icon={icon}
            size={size}
            style={{ lineHeight: actionSize }}
          />
        </Touchable>
        {!noText && (
          <UFOText
            h10
            upper
            inverted={!inverted}
            style={{ marginTop: 5 }}
          >
            {t(icon.i18nKey)}
          </UFOText>
        )}
      </View>
    );
  }

  getElevation = style => {
    if (style.elevation) {
      return style.elevation;
    }

    switch (style) {
      case actionStyles.TODO:
        return 4;
      case actionStyles.ACTIVE:
        return 3;
      case actionStyles.DONE:
        return 2;
      case actionStyles.DISABLE:
        return 0;
      default:
        return 0;
    }
  };
}

UFOAction.propTypes = {
  actions: PropTypes.object,
  activityPending: PropTypes.bool,
  inverted: PropTypes.bool,
  noText: PropTypes.bool,
  size: PropTypes.object
};

export default translate()(UFOAction);

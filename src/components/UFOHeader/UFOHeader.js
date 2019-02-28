import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import screenKeys from './../../navigators/helpers/screenKeys';
import { UFOIcon } from './../common';
import styles from './styles';
import { values } from './../../utils/theme';

class UFOHeader extends PureComponent {
  render() {
    return (
      <View style={styles.header}>
        {this.renderLeftBtn()}
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {this.props.title}
        </Text>
        {this.renderRightBtn()}
      </View>
    );
  }

  renderLeftBtn = () => {
    const { leftBtnUseDefault, leftBtnAction, leftBtnIcon } = this.props;

    if (!leftBtnAction && !leftBtnUseDefault) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={leftBtnUseDefault ? this.leftBtnDefaultAction : leftBtnAction}
        style={styles.leftBtn}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <UFOIcon
          name={leftBtnIcon}
          iconPack="MaterialCommunity"
          animated={true}
          style={styles.actionIcon}
        />
      </TouchableOpacity>
    );
  };

  renderRightBtn = () => {
    const { rightBtnUseDefault, rightBtnAction, rightBtnIcon } = this.props;

    if (!rightBtnAction && !rightBtnUseDefault) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={rightBtnUseDefault ? this.rightBtnDefaultAction : rightBtnAction}
        style={styles.rightBtn}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <UFOIcon
          name={rightBtnIcon}
          iconPack="MaterialCommunity"
          animated={true}
          style={styles.actionIcon}
        />
      </TouchableOpacity>
    );
  };

  leftBtnDefaultAction = () => {
    this.props.navigation.navigate(screenKeys.Home);
  };

  rightBtnDefaultAction = () => {
    this.props.navigation.navigate(screenKeys.SupportFaqs);
  };
}

UFOHeader.defaultProps = {
  leftBtnIcon: 'keyboard-backspace',
  rightBtnIcon: 'help-circle-outline'
};

UFOHeader.propTypes = {
  title: PropTypes.string.isRequired,
  leftBtnUseDefault: PropTypes.bool,
  leftBtnAction: PropTypes.func,
  leftBtnIcon: PropTypes.string,
  rightBtnUseDefault: PropTypes.bool,
  rightBtnAction: PropTypes.func,
  rightBtnIcon: PropTypes.string
};

export default withNavigation(UFOHeader);

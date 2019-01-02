import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import { sizes, colors, icons } from './../../utils/global';

export default class UFOIcon_old extends PureComponent {
  render() {
    const { icon, color, inverted, size, style } = this.props;
    const name = `md-${icon && icon.name ? icon.name : icons.WRONG}`;
    const fontSize = size && size.fontSize ? size.fontSize : sizes.MASSIVE.fontSize;
    const iconColor = color ? color : inverted ? colors.ACTIVE : colors.ICON;

    return (
      <Icon
        name={name}
        size={fontSize}
        color={iconColor.string()}
        style={style}
      />
    );
  }
}

UFOIcon_old.propTypes = {
  icon: PropTypes.shape({ name: PropTypes.string }),
  size: PropTypes.shape({ fontSize: PropTypes.number }),
  color: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  inverted: PropTypes.bool,
  style: PropTypes.any
};

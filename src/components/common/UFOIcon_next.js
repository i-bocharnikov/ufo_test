import React, { Component } from 'react';
import { Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

export default class UFOIcon_next extends Component {
  render() {
    const { name, style, iconPack, animated } = this.props;
    let Icon;

    switch(iconPack) {
      case 'Ionicons':
        Icon = Ionicons;
        break;
      case 'Entypo':
        Icon = Entypo;
        break;
      case 'MaterialCommunity':
        Icon = MaterialCommunity;
        break;
      default:
        Icon = Ionicons;
    }

    if (animated) {
      Icon = Animated.createAnimatedComponent(Icon);
    }

    return (
      <Icon
        name={name}
        style={style}
      />
    );
  }
}

UFOIcon_next.defaultProps = {
  iconPack: 'Ionicons'
};

UFOIcon_next.propTypes = {
  name: PropTypes.string,
  style: PropTypes.any,
  animated: PropTypes.bool,
  iconPack: PropTypes.oneOf([
    'Ionicons',
    'Entypo',
    'MaterialCommunity'
  ])
};

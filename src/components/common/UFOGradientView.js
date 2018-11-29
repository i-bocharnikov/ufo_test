import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

export default class UFOGradientView extends Component {
  render() {
    const { topColor, bottomColor, children, ...viewProps } = this.props;

    return (
      <LinearGradient
        colors={[topColor, bottomColor]}
        start={{x: 1, y: 0}} end={{x: 1, y: 1}}
        { ...viewProps }
      >
        {children}
      </LinearGradient>
    );
  }
}

UFOGradientView.propTypes = {
  topColor: PropTypes.string,
  bottomColor: PropTypes.string
};

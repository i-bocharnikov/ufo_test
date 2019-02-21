import React, { PureComponent } from 'react';
import { Animated, View, StyleSheet, LayoutAnimation, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { colors } from './../../utils/theme';

const INDICATOR_HEIGHT = 8;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  indicator: {
    height: INDICATOR_HEIGHT,
    borderTopRightRadius: INDICATOR_HEIGHT / 2,
    borderBottomRightRadius: INDICATOR_HEIGHT / 2,
    backgroundColor: colors.MAIN_COLOR,
    width: 0
  },
  indicatorFull: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
});

export default class UFOProgressLine extends PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.progress && this.props.progress !== prevProps.progress) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 100
      });
    }
  }

  render() {
    const { style, indicatorColor } = this.props;

    return (
      <View style={[ styles.wrapper, style ]}>
        <Animated.View style={[
          styles.indicator,
          indicatorColor && { backgroundColor: indicatorColor },
          this.progress === 100 && styles.indicatorFull,
          { width: `${this.progress}%` }
        ]} />
      </View>
    );
  }

  get progress() {
    const { progress } = this.props;

    if (!progress || typeof progress !== 'number') {
      return 0;
    }

    if (progress < 0) {
      return 0;
    }

    if (progress > 100) {
      return 100;
    }

    return progress;
  }
}

UFOProgressLine.propTypes = {
  progress: PropTypes.number,
  style: ViewPropTypes.style,
  indicatorColor: PropTypes.string
};

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Animated,
  ProgressBarAndroid,
} from 'react-native';
import PropTypes from 'prop-types';

import UFOAction from './UFOAction';
import { colors } from './../utils/global';

const styles = StyleSheet.create({
  actionBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start'
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flex: 1
  },
  progressBar: {
    height: 14
  },
  progressBarAndroid: {
    height: 24
  }
});

export default class UFOActionBar extends Component {
  constructor() {
    super();
    this.state = {
      fadeAnim: new Animated.Value(0),
      bottomAnimatedPosition: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 500
      }
    ).start();
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 500
      }
    ).start();
  }

  render() {
    const {
      actions = [],
      activityPending = false,
      inverted = false
    } = this.props;
    const { fadeAnim, bottomAnimatedPosition } = this.state;

    return (
      <Animated.View style={[
        styles.actionBarContainer,
        {bottom: bottomAnimatedPosition, opacity: fadeAnim}
      ]}>
        <View style={styles.progressBar}>
          {activityPending && (
            <ProgressBarAndroid
              style={styles.progressBarAndroid}
              styleAttr="Horizontal"
              color={colors.SUCCESS.string()}
            />
          )}
        </View>
        <View style={styles.actionBar}>
          {actions.map((action, index) => (
            <UFOAction
              action={action}
              key={index}
              activityPending={activityPending}
              inverted={inverted}
            />
          ))}
        </View>
      </Animated.View>
    );
  }

  keyboardDidShow = event => {
    Animated.timing(
      this.state.bottomAnimatedPosition,
      {
        toValue: event.endCoordinates.height,
        duration: 500,
      }
    ).start();
  };

  keyboardDidHide = () => {
    Animated.timing(
      this.state.bottomAnimatedPosition,
      {
        toValue: 0,
        duration: 500,
      }
    ).start();
  };
}

UFOActionBar.propTypes = {
  actions: PropTypes.array,
  activityPending: PropTypes.bool,
  inverted: PropTypes.bool
};

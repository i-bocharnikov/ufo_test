import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Animated,
  ProgressBarAndroid,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';

import UFOAction from './UFOAction';
import { colors } from './../utils/theme';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const ACTION_BAR_HEIGHT = 80;

const styles = StyleSheet.create({
  actionBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ACTION_BAR_HEIGHT,
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
  progressBar: { height: 14 },
  progressBarAndroid: { height: 24 },
  loaderIOS: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2,
    alignSelf: 'center',
    transform: [{ translateY: 20 }]
  }
});

export default class UFOActionBar extends Component {
  constructor() {
    super();
    this.animationDuration = 500;
    this.animations = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    this.animateToShow(true);
  }

  componentDidUpdate(prevProps) {
    const actions = this.props.actions;
    const prevActions = prevProps.actions;

    if (!actions || !prevActions) {
      return;
    }

    if (actions.length && prevActions.length && prevActions.length !== actions.length) {
      this.updateActionsWithAnimation();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    const { opacity, bottom } = this.animations;
    const {
      actions = [],
      activityPending = false,
      inverted = false
    } = this.props;

    return (
      <Animated.View style={[
        styles.actionBarContainer,
        { bottom, opacity }
      ]}
      >
        {activityPending && this.renderProgressView()}
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

  renderProgressView = () => {
    return Platform.OS === 'ios' ? (
      <ActivityIndicator
        style={styles.loaderIOS}
        animating={true}
        size="large"
      />
    ) : (
      <View style={styles.progressBar}>
        <ProgressBarAndroid
          style={styles.progressBarAndroid}
          styleAttr="Horizontal"
          color={colors.SUCCESS_COLOR}
        />
      </View>
    );
  };

  animateToShow = doLaunch => {
    const animation = Animated.timing(
      this.animations.opacity,
      {
        toValue: 1,
        duration: this.animationDuration
      }
    );

    if (doLaunch) {
      animation.start();
    }

    return animation;
  };

  animateToHide = () => Animated.timing(this.animations.opacity, { toValue: 0, duration: 0 });

  updateActionsWithAnimation = () => {
    Animated.sequence([
      this.animateToHide(),
      this.animateToShow()
    ]).start();
  };

  keyboardDidShow = event => {
    Animated.timing(
      this.animations.bottom,
      {
        toValue: event.endCoordinates.height,
        duration: this.animationDuration
      }
    ).start();
  };

  keyboardDidHide = () => {
    Animated.timing(
      this.animations.bottom,
      {
        toValue: 0,
        duration: this.animationDuration
      }
    ).start();
  };
}

UFOActionBar.propTypes = {
  actions: PropTypes.array,
  activityPending: PropTypes.bool,
  inverted: PropTypes.bool
};

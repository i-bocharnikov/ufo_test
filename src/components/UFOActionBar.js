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
        { bottom: bottomAnimatedPosition, opacity: fadeAnim }
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

  keyboardDidShow = event => {
    Animated.timing(
      this.state.bottomAnimatedPosition,
      {
        toValue: event.endCoordinates.height,
        duration: 500
      }
    ).start();
  };

  keyboardDidHide = () => {
    Animated.timing(
      this.state.bottomAnimatedPosition,
      {
        toValue: 0,
        duration: 500
      }
    ).start();
  };
}

UFOActionBar.propTypes = {
  actions: PropTypes.array,
  activityPending: PropTypes.bool,
  inverted: PropTypes.bool
};

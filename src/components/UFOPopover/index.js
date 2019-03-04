import React, { Component } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import { UFOImage } from './../common';
import styles from './styles';
import { images } from './../../utils/theme';

export default class UFOPopover extends Component {
  constructor() {
    super();
    this.defaultTitle = 'UFODRIVE';
    this.durationToShow = 500;
    this.durationToHide = 200;
    this.swipeTarck = 40;
    this.state = {
      visibleMessage: null,
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0)
    };
  }

  componentDidMount() {
    if (this.props.message) {
      this.showPopover();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const message = this.props.message;
    const visibleMessage = this.state.visibleMessage;
    const prevVisibleMessage = prevState.visibleMessage;

    if (this.props.showOnce && message === prevProps.message) {
      return;
    }

    if (!message && visibleMessage) {
      this.hidePopover();

    } else if (message && !visibleMessage && !prevVisibleMessage) {
      this.showPopover();

    } else if (message && visibleMessage && message !== visibleMessage) {
      this.showPopover(true);
    }
  }

  render() {
    const { opacity, visibleMessage, translateY, translateX } = this.state;

    return !!visibleMessage && (
      <Animated.View style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { translateX }],
          ...this.props.positionOffsets
        }
      ]}
      >
        <GestureRecognizer
          onSwipe={this.hidePopover}
          style={styles.gestureWrapper}
        >
          <View style={styles.titleRow}>
            <UFOImage
              source={images.ufoAppIcon}
              style={styles.icon}
            />
            <Text style={styles.title}>
              {this.defaultTitle}
            </Text>
          </View>
          <Text style={styles.message}>
            {visibleMessage}
          </Text>
        </GestureRecognizer>
      </Animated.View>
    );
  }

  showPopover = isReplace => {
    const visibleMessage = this.props.message;
    const animate = () => Animated.parallel([
      this.animateToShow(),
      this.animateToLeft(true),
      this.animateToTop(true)
    ]).start();
    this.setState({ visibleMessage }, !isReplace ? animate : null);
  };

  hidePopover = gestureName => {
    const swipeAnimations = [];
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    const hide = () => this.setState({ visibleMessage: null });

    switch (gestureName) {
      case SWIPE_UP:
        swipeAnimations.push( this.animateToTop() );
        break;
      case SWIPE_DOWN:
        swipeAnimations.push( this.animateToBottom() );
        break;
      case SWIPE_LEFT:
        swipeAnimations.push( this.animateToLeft() );
        break;
      case SWIPE_RIGHT:
        swipeAnimations.push( this.animateToRight() );
        break;
    }

    Animated.parallel([ this.animateToHide(), ...swipeAnimations ]).start(hide);
  };

  animateToShow = () => Animated.timing(
    this.state.opacity,
    {
      toValue: 1,
      easing: Easing.linear(),
      duration: this.durationToShow
    }
  );

  animateToHide = () => Animated.timing(
    this.state.opacity,
    {
      toValue: 0,
      easing: Easing.linear(),
      duration: this.durationToHide
    }
  );

  animateToLeft = isReset => Animated.timing(
    this.state.translateX,
    {
      toValue: isReset ? 0 : -this.swipeTarck,
      easing: Easing.linear(),
      duration: isReset ? 0 : this.durationToHide
    }
  );

  animateToRight = isReset => Animated.timing(
    this.state.translateX,
    {
      toValue: isReset ? 0 : this.swipeTarck,
      easing: Easing.linear(),
      duration: isReset ? 0 : this.durationToHide
    }
  );

  animateToTop = isReset => Animated.timing(
    this.state.translateY,
    {
      toValue: isReset ? 0 : -this.swipeTarck,
      easing: Easing.linear(),
      duration: isReset ? 0 : this.durationToHide
    }
  );

  animateToBottom = isReset => Animated.timing(
    this.state.translateY,
    {
      toValue: isReset ? 0 : this.swipeTarck,
      easing: Easing.linear(),
      duration: isReset ? 0 : this.durationToHide
    }
  );
}

UFOPopover.defaultProps = { positionOffsets: {} };

UFOPopover.propTypes = {
  message: PropTypes.string,
  showOnce: PropTypes.bool,
  positionOffsets: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })
};

import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { UFOImage, UFOText, UFOVideo } from './../common';
import styles from './styles';

export default class UFOCard extends Component {
  render() {
    return (
      <View style={styles.cardContainer}>
        {this.renderMedia()}
        {this.renderText()}
        {this.renderChildren()}
        {this.renderMessage()}
      </View>
    );
  }

  renderMedia() {
    const { imageSource, videoSource, imageResizeMode, message, children } = this.props;

    if (!this.hasMedia) {
      return null;
    }

    const mediaStyles = this.hasText || children || message
      ? styles.topContainer
      : styles.singleContainer;

    return (
      <View style={[ styles.cardItem, styles.cardItemBody, mediaStyles ]}>
        {imageSource && (
          <UFOImage
            source={imageSource}
            style={styles.media}
            resizeMode={imageResizeMode}
          />
        )}
        {videoSource && (
          <UFOVideo
            source={videoSource}
            style={styles.media}
            resizeMode={imageResizeMode}
          />
        )}
      </View>
    );
  }

  renderText() {
    const { title, message, children } = this.props;

    if (!this.hasText) {
      return null;
    }

    const textStyles = this.hasMedia
      ? children || message
        ? null
        : styles.bottomContainer
      : children || message
        ? styles.topContainer
        : styles.singleContainer;

    return (
      <View style={[ styles.cardItem, textStyles ]}>
        <View style={styles.left}>
          <View style={styles.body}>
            <UFOText h5 upper style={styles.title}>
              {title}
            </UFOText>
            {this.texts.map((item, index) => (
              <UFOText key={index} note>{item}</UFOText>
            ))}
          </View>
        </View>
      </View>
    );
  }

  renderChildren() {
    const { message, children } = this.props;

    if (!children) {
      return null;
    }

    const childrenStyles = this.hasMedia || this.hasText
      ? message
        ? null
        : styles.bottomContainer
      : message
        ? styles.topContainer
        : styles.singleContainer;

    return (
      <View style={[ styles.cardItem, childrenStyles ]}>
        {children}
      </View>
    );
  }

  renderMessage() {
    const { message, children } = this.props;

    if (!message) {
      return null;
    }

    const messageStyles = this.hasMedia || this.hasText || children
      ? styles.bottomContainer
      : styles.singleContainer;

    return (
      <View style={[ styles.cardItem, messageStyles ]}>
        <View style={styles.left}>
          <View style={styles.body}>
            <UFOText h5 note>{message}</UFOText>
          </View>
        </View>
      </View>
    );
  }

  get hasMedia() {
    return !!(this.props.imageSource || this.props.videoSource);
  }

  get hasText() {
    return !!(this.props.title || this.texts.length > 0);
  }

  get texts() {
    const texts = this.props.texts || [];

    if (this.props.text) {
      texts.push(this.props.text);
    }

    return texts;
  }
}

UFOCard.propTypes = {
  title: PropTypes.string,
  texts: PropTypes.array,
  text: PropTypes.string,
  imageSource: PropTypes.any,
  imageResizeMode: PropTypes.string,
  videoSource: PropTypes.any,
  children: PropTypes.node,
  message: PropTypes.string
};

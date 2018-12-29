import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardItem, Body, Left } from 'native-base';
import PropTypes from 'prop-types';

import { UFOImage, UFOText, UFOVideo } from './common';

const CARD_RADIUS = 8;

const styles = StyleSheet.create({
  topContainer: {
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS
  },
  bottomContainer: {
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS
  },
  singleContainer: {
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS
  },
  media: {
    flex: 1,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    height: 250
  },
  cardContainer: { backgroundColor: 'transparent' }
});

export default class UFOCard extends Component {
  render() {
    const {
      title,
      texts = [],
      text,
      imageSource,
      videoSource,
      imageResizeMode,
      message,
      children
    } = this.props;

    if (text) {
      texts.push(text);
    }

    const hasMedia = imageSource || videoSource;
    const hasText = title || (texts.length > 0);

    const mediaStyles = hasText || children || message
      ? styles.topContainer
      : styles.singleContainer;

    const textStyles = hasMedia
      ? children || message
        ? null
        : styles.bottomContainer
      : children || message
        ? styles.topContainer
        : styles.singleContainer;

    const childrenStyles = hasMedia || hasText
      ? message
        ? null
        : styles.bottomContainer
      : message
        ? styles.topContainer
        : styles.singleContainer;

    const messageStyles = hasMedia || hasText || children
      ? styles.bottomContainer
      : styles.singleContainer;

    return (
      <Card style={styles.cardContainer}>
        {hasMedia && (
          <CardItem
            cardBody
            style={mediaStyles}
          >
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
          </CardItem>
        )}
        {hasText && (
          <CardItem style={textStyles}>
            <Left>
              <Body>
                <UFOText
                  h5
                  upper
                >{title}</UFOText>
                {texts.map((text, index) => <UFOText
                  key={index}
                  note
                >{text}</UFOText>)}
              </Body>
            </Left>
          </CardItem>
        )}
        {children && (
          <CardItem style={childrenStyles}>
            {children}
          </CardItem>
        )}
        {message && (
          <CardItem style={messageStyles}>
            <Left>
              <Body>
                <UFOText
                  h5
                  note
                >{message}</UFOText>
              </Body>
            </Left>
          </CardItem>
        )}
      </Card>
    );
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

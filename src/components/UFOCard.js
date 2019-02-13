import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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
  singleContainer: { borderRadius: CARD_RADIUS },
  media: {
    flex: 1,
    height: 250,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS
  },
  cardContainer: {
    flexWrap: 'nowrap',
    marginVertical: 5,
    marginHorizontal: 2,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3
  },
  cardItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    flexDirection: 'row',
    paddingBottom: 12,
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 12
  },
  cardItemBody: {
    paddingBottom: -5,
    paddingLeft: -5,
    paddingRight: -5,
    paddingTop: -5,
  },
  left: {
    flexDirection: "row",
    alignItems:"flex-start",
    alignSelf:"center",
    flex:1
  },
  body: {
    alignSelf: "center",
    flex: 1,
    marginLeft: 10,
    alignItems: null,
  },
  title: { marginBottom: 8 }
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
      <View style={styles.cardContainer}>
        {hasMedia && (
          <View
            style={[styles.cardItem, styles.cardItemBody, mediaStyles]}
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
          </View>
        )}
        {hasText && (
          <View style={[styles.cardItem, textStyles]}>
            <View style={styles.left}>
              <View style={styles.body}>
                <UFOText
                  h5
                  upper
                  style={styles.title}
                >
                  {title}
                </UFOText>
                {texts.map((item, index) => <UFOText
                  key={index}
                  note
                >{item}</UFOText>)}
              </View>
            </View>
          </View>
        )}
        {children && (
          <View style={[styles.cardItem, childrenStyles]}>
            {children}
          </View>
        )}
        {message && (
          <View style={[styles.cardItem, messageStyles]}>
            <View style={styles.left}>
              <View style={styles.body}>
                <UFOText
                  h5
                  note
                >{message}</UFOText>
              </View>
            </View>
          </View>
        )}
      </View>
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

import React, { Component } from 'react';
import { Image, ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import { SAVE_TOKEN } from './../../utils/api_deprecated';
import configurations from './../../utils/configurations';

const ownStyles = StyleSheet.create({
  preloader: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  }
});

export default class UFOImage extends Component {
  render() {
    const { fallbackToImage, source, style, children, ...restProps } = this.props;
    const uri = this.getImageUri(source);
    const isLoading = uri === 'loading';
    const isRefImage = source && source.reference;

    return (uri && !fallbackToImage) ? (
      <FastImage
        style={[ style, isLoading && ownStyles.preloader ]}
        source={{
          uri,
          headers: isRefImage ? { Authorization: `Bearer ${SAVE_TOKEN}` } : {}
        }}
        {...restProps}
      >
        {isLoading ? <ActivityIndicator animating={true} /> : children}
      </FastImage>
    ) : (
      <Image
        source={this.getSafeSource}
        style={style}
        {...restProps}
      />
    );
  }

  get getSafeSource() {
    const source = this.props.source;

    if (source && source.hasOwnProperty('uri') && !source.uri) {
      return null;
    }

    return source;
  }

  getImageUri = (source = {}) => {
    if (source.reference) {
      const uri = `${
        configurations.UFO_SERVER_API_URL
      }api/${
        configurations.UFO_SERVER_API_VERSION
      }/documents/${
        source.reference
      }`;

      return uri;
    } else if (source.uri) {
      return source.uri;
    } else {
      return null;
    }
  };
}

UFOImage.propTypes = {
  /*
   * for rendering local images (assets) used Image component with all his props
   * for other images used FastImage, read doc about it, some props can be expanded
   */
  ...FastImage.propTypes,
  ...Image.propTypes,
  /* use exactly Image component. Don't mix FastImage.props with this prop */
  fallbackToImage: PropTypes.bool
};

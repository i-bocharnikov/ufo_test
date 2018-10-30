import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const ownStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
});

export default class UFOContainer extends Component {
  render() {
    const { image, children, style } = this.props;

    return image ? (
      <ImageBackground
        style={[ownStyles.container, style]}
        source={image}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    ) : (
      <View style={[ownStyles.container, style]}>
        {children}
      </View>
    );
  }
}

UFOContainer.propTypes = {
  image: Image.propTypes.source,
  style: ViewPropTypes.style,
  children: PropTypes.node
};

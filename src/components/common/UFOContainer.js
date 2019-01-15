import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default class UFOContainer extends Component {
  render() {
    const { image, children, style } = this.props;

    return image ? (
      <ImageBackground
        style={[ styles.container, style ]}
        source={image}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    ) : (
      <View style={[ styles.container, style ]}>
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

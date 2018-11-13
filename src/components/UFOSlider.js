import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SLIDE_DEFAULT_WIDTH = SCREEN_WIDTH * 0.9;

export default class UFOSlider extends React.Component {
  render() {
    const carouselProps = this.props;

    return (
      <Carousel { ...carouselProps } />
    );
  }
}

UFOSlider.defaultProps = {
  data: [],
  sliderWidth: SCREEN_WIDTH,
  itemWidth: SLIDE_DEFAULT_WIDTH,
  inactiveSlideScale: 0.94
};

UFOSlider.propTypes = {
  ...Carousel.propTypes
};

import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

import { UFOText } from './common';

const SLIDER_DEVICE_WIDTH = Dimensions.get('window').width;
const SLIDE_WIDTH = SLIDER_DEVICE_WIDTH * 90 / 100;

export default class UFOSlider extends React.Component {
  render() {
    const {
      data = [],
      firstItem = 0,
      renderItem,
      onSnapToItem,
    } = this.props;
    const onSnap = onSnapToItem || this.onSnapDefault;

    return (
      <Carousel
        ref={c => (this.carousel = c)}
        data={data}
        firstItem={firstItem}
        renderItem={renderItem}
        sliderWidth={SLIDER_DEVICE_WIDTH}
        itemWidth={SLIDE_WIDTH}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        onSnapToItem={onSnap}
      />
    );
  }

  onSnapDefault = slideIndex => {
    return slideIndex;
  };
}

UFOSlider.propTypes = {
  renderItem: PropTypes.func.isRequired,
  data: PropTypes.array,
  firstItem: PropTypes.number,
  onSnapToItem: PropTypes.func
};

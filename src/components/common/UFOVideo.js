import React, { Component } from 'react';
import Video from 'react-native-video';

export default class UFOVideo extends Component {
  render() {
    const { resizeMode, ...restProps } = this.props;

    return (
      <Video
        ref={ref => (this.player = ref)}
        resizeMode={resizeMode || 'cover'}
        repeat={true}
        { ...restProps }
      />
    );
  }
}

UFOVideo.propTypes = {
  ...Video.propTypes
};

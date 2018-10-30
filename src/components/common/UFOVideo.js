import React, { Component } from 'react';
import Video from 'react-native-video';

export default class UFOVideo extends Component {
  render() {
    const props = this.props;

    return (
      <Video
        ref={ref => (this.player = ref)}
        { ...props }
      />
    );
  }
}

UFOVideo.defaultProps = {
  repeat: true,
  resizeMode: 'cover'
};

UFOVideo.propTypes = {
  ...Video.propTypes
};

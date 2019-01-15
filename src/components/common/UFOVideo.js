import React, { PureComponent } from 'react';
import { View, StyleSheet, ViewPropTypes, Platform } from 'react-native';
import VideoIOS from 'react-native-video';
import VideoAndroid from 'react-native-video-controls';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { showToastError } from './../../utils/interaction';

const Video = Platform.OS === 'android' ? VideoAndroid : VideoIOS;

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden' },
  videoView: {
    width: '100%',
    height: '100%'
  }
});

export default class UFOVideo extends PureComponent {
  render() {
    const { style, ...restProps } = this.props;

    return (
      <View style={[ styles.wrapper, style ]}>
        <Video
          ref={ref => (this.player = ref)}
          onError={this.hendleError}
          style={styles.videoView}
          {...restProps}
        />
      </View>
    );
  }

  hendleError = error => {
    if (this.props.errorHandling && _.has(error, 'message')) {
      showToastError(error.message);
    }
  };
}

UFOVideo.defaultProps = {
  errorHandling: true,
  repeat: true,
  resizeMode: 'contain',
  controls: true,
  paused: true,
  volume: 0.5,
  /* android only props */
  disableBack: true,
  disableVolume: true
};

UFOVideo.propTypes = {
  style: ViewPropTypes.style,
  errorHandling: PropTypes.bool,
  ...VideoIOS.propTypes,
  ...VideoAndroid.propTypes
};

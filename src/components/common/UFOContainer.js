import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Image, ViewPropTypes } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  videoBgWrapper: {
    backgroundColor: 'transparent'
  },
  videoView: {
    ...StyleSheet.absoluteFill
  },
  videoBgShadow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
});

export default class UFOContainer extends Component {
  constructor() {
    super();
    this.state = {
      videoBgFailure: false,
      hideVideo: false
    };
  }

  componentDidUpdate(prevProps) {
    const video = this.props.video;
    const prevVideo = prevProps.video;

    /* fix for issue, when video changes to new source, videoView saves previous sides ratio */
    if (video && prevVideo && video !== prevVideo) {
      this.setState(
        { hideVideo: true },
        () => this.setState({ hideVideo: false })
      );
    }
  }

  render() {
    if (this.props.video) {
      return this.containerVideoBg;
    } else if (this.props.image) {
      return this.containerImageBg;
    } else {
      return this.containerDefault;
    }
  }

  get containerDefault() {
    const { children, style } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        {children}
      </View>
    );
  }

  get containerImageBg() {
    const { image, children, style } = this.props;

    return (
      <ImageBackground
        style={[ styles.container, style ]}
        source={image}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  }

  get containerVideoBg() {
    const { video, image, children, style, shadowVideo } = this.props;

    if (this.state.hideVideo) {
      return this.containerDefault;
    }

    if (this.state.videoBgFailure) {
      return image ? this.containerImageBg : this.containerDefault;
    }

    return (
      <View style={[ styles.container, styles.videoBgWrapper, style ]}>
        <Video
          allowsExternalPlayback={false}
          useTextureView={false}
          playWhenInactive={true}
          playInBackground={false}
          controls={false}
          muted={true}
          repeat={true}
          resizeMode="cover"
          source={video}
          style={styles.videoView}
          onError={this.hendleVideoError}
        />
        {shadowVideo && <View style={styles.videoBgShadow} />}
        {children}
      </View>
    );
  }

  hendleVideoError = error => {
    if (__DEV__) {
      console.error(error);
    }

    this.setState({ videoBgFailure: true });
  }
}

UFOContainer.defaultProps = {
  shadowVideo: true
};

UFOContainer.propTypes = {
  /* you also can set `image` with `video`, it will works like fallback background */
  image: Image.propTypes.source,
  video: Video.propTypes.source,
  shadowVideo: PropTypes.bool,
  style: ViewPropTypes.style,
  children: PropTypes.node
};

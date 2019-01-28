import React, { PureComponent } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999
  }
});

export default class UFOLoader extends PureComponent {
  render() {
    const { fallbackToNative, isModal, isVisible, stealthMode, ...indicatorProps } = this.props;

    if (fallbackToNative) {
      return <ActivityIndicator animating={isVisible} { ...indicatorProps } />;
    }

    if (isModal) {
      return (
        <Modal
          transparent={true}
          visible={isVisible}
          onRequestClose={() => false}
        >
          {!stealthMode && (
            <View style={styles.wrapper}>
              <ActivityIndicator { ...indicatorProps } />
            </View>
          )}
        </Modal>
      );
    }

    return isVisible ? (
      <View style={[ styles.absoluteFill, styles.wrapper ]}>
        {!stealthMode && <ActivityIndicator { ...indicatorProps } />}
      </View>
    ) : null;
  }
}

UFOLoader.defaultProps = {
  isModal: true,
  size: 'large',
  ...Platform.select({
    ios: { color: 'rgba(255,255,255,0.9)' }
  })
};

UFOLoader.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isModal: PropTypes.bool,
  stealthMode: PropTypes.bool,
  fallbackToNative: PropTypes.bool,
  ...ActivityIndicator.propTypes
};

/*
 * Props descripion:
 * 1. use `isModal=false` it to avoid this issue: (https://github.com/facebook/react-native/issues/10471), when simultaneously can be opened couple Modal.
 * loader will not cover all screen only current component container
 * 2. use `stealthMode=true` to lock screen without visible actions
 * 3. `fallbackToNative=true` - use ActivityIndicator without wrappers
*/

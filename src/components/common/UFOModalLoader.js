import React, { PureComponent } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class UFOModalLoader extends PureComponent {
  render() {
    const { isVisible } = this.props;

    return (
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => false}
      >
        <View style={styles.wrapper}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>
    );
  }
}

UFOModalLoader.propTypes = {
  isVisible : PropTypes.bool.isRequired
};

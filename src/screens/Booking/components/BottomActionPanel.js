import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import styles from './../styles';
import { values } from './../../../utils/theme';

export default class BottomActionPanel extends PureComponent {
  render() {
    const {
      t,
      action,
      actionTitle,
      actionSubTitle,
      isAvailable,
      price
    } = this.props;

    return (
      <View style={styles.bottomPanel}>
        <View style={[styles.bottomPanelSection, styles.bottomPanelInfo]}>
          <Text style={styles.bottomPanelPriceLabel}>
            {t('booking:totalPrice')}
          </Text>
          <Text style={styles.bottomPanelPriceValue}>
            {price}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bottomPanelSection, styles.bottomPanelActionBtn]}
          activeOpacity={isAvailable ? values.BTN_OPACITY_DEFAULT : 1}
          onPress={isAvailable ? action : null}
        >
          <Text style={styles.bottomPanelActionTitle}>
            {actionTitle}
          </Text>
          {actionSubTitle && (
            <Text style={styles.bottomPanelActionSubTitle}>
              {actionSubTitle}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

BottomActionPanel.defaultProps = {
  price: '0€'
};

BottomActionPanel.propTypes = {
  t: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  actionTitle: PropTypes.string.isRequired,
  actionSubTitle: PropTypes.string,
  isAvailable: PropTypes.bool,
  price: PropTypes.string
};

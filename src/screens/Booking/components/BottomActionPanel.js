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
      price,
      isAlternative,
      overlapMessage
    } = this.props;
    const isBtnActive = isAvailable || isAlternative;

    return (
      <View style={styles.bottomPanel}>
        <View style={[ styles.bottomPanelInfo ]}>
          <Text style={styles.bottomPanelPriceLabel}>
            {t('booking:totalPrice')}
          </Text>
          <Text style={styles.bottomPanelPriceValue}>
            {price}
          </Text>
          {overlapMessage && this.renderOverlap()}
        </View>
        <TouchableOpacity
          style={styles.bottomPanelActionBtn}
          activeOpacity={isBtnActive ? values.BTN_OPACITY_DEFAULT : 1}
          onPress={isBtnActive ? action : null}
        >
          <Text style={[
            styles.bottomPanelActionTitle,
            !isBtnActive && styles.opacityLabel
          ]}
          >
            {!isAlternative ? actionTitle : t('booking:applyBtn').toUpperCase()}
          </Text>
          {actionSubTitle && !isAlternative && (
            <Text style={[
              styles.bottomPanelActionSubTitle,
              !isBtnActive && styles.opacityLabel
            ]}
            >
              {actionSubTitle}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  renderOverlap = () => {
    const { isAlternative, overlapMessage } = this.props;

    return (
      <View style={styles.bottomPanelOverlap}>
        <Text style={isAlternative ? styles.bottomPanelAlternative : styles.bottomPanelNotAvailable}>
          {overlapMessage}
        </Text>
      </View>
    );
  };
}

BottomActionPanel.defaultProps = { price: '0€' };

BottomActionPanel.propTypes = {
  t: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  actionTitle: PropTypes.string.isRequired,
  actionSubTitle: PropTypes.string,
  isAvailable: PropTypes.bool,
  price: PropTypes.string,
  isAlternative: PropTypes.bool,
  overlapMessage: PropTypes.string
};

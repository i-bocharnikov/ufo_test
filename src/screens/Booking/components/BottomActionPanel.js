import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { bookingStore } from './../../../stores';
import styles from './../styles';
import { values } from './../../../utils/theme';

@observer
class BottomActionPanel extends Component {
  render() {
    const { t, action, actionTitle, actionSubTitle, isAvailable } = this.props;
    const isAlternative = bookingStore.isOrderCarHasAlt;
    const isBtnActive = isAvailable || isAlternative;

    return (
      <View style={styles.bottomPanel}>
        <View style={styles.bottomPanelInfo}>
          <Text style={styles.bottomPanelPriceLabel}>
            {t('booking:totalPrice')}
          </Text>
          <View>
            <Text style={styles.bottomPanelPriceValue}>
              {this.priceLabel}
            </Text>
            {this.renderMarketingLabel()}
          </View>
          {this.renderOverlap()}
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
            {!isAlternative ? actionTitle : t('booking:applyBtn')}
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
    if (!bookingStore.orderCarUnavailableMessage) {
      return null;
    }

    return (
      <View style={styles.bottomPanelOverlap}>
        <Text style={bookingStore.isOrderCarHasAlt
          ? styles.bottomPanelAlternative
          : styles.bottomPanelNotAvailable
        }
        >
          {bookingStore.orderCarUnavailableMessage}
        </Text>
      </View>
    );
  };

  renderMarketingLabel = () => {
    if (!bookingStore.priceMarketingLabel) {
      return null;
    }

    return (
      <Text style={styles.bottomPanelMarketing}>
        {bookingStore.priceMarketingLabel}
      </Text>
    );
  };

  get priceLabel() {
    if (bookingStore.orderOriginPrice && bookingStore.orderOriginPrice !== bookingStore.orderPrice) {
      return (
        <Fragment>
          <Text style={styles.bottomPanelOriginValue}>
            {bookingStore.orderOriginPrice}
          </Text>
          <Text>
            {bookingStore.orderPrice}
          </Text>
        </Fragment>
      );
    }

    return bookingStore.orderPrice;
  }
}

BottomActionPanel.propTypes = {
  action: PropTypes.func.isRequired,
  actionTitle: PropTypes.string.isRequired,
  actionSubTitle: PropTypes.string,
  isAvailable: PropTypes.bool
};

export default translate('booking')(BottomActionPanel);

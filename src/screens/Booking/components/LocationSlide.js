import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { UFOImage } from './../../../components/common';
import styles from './../styles';
import { values } from './../../../utils/theme';

export default class LocationSlide extends PureComponent {
  render() {
    const {
      t,
      location,
      isSelected,
      isFirstItem
    } = this.props;

    return (
      <TouchableOpacity
        onPress={this.handleSelect}
        activeOpacity={location.available ? values.BTN_OPACITY_DEFAULT : 1}
        style={[
          styles.locSlide,
          styles.blockShadow,
          !isFirstItem && styles.locSlideLeftSpace
        ]}
      >
        {location.message && (
          <Text style={styles.locSlideMessage} numberOfLines={1}>
            {location.message.toUpperCase()}
          </Text>
        )}
        <UFOImage
          source={{ uri: location.imageUrl }}
          style={[ styles.locSlideImg, !location.available && styles.notAvailable ]}
        />
        <View style={[
          styles.locSlideLabelWrapper,
          isSelected && styles.choosenLocation,
          !location.available && styles.notAvailable
        ]}
        >
          <Text style={styles.locSlideLabel} numberOfLines={3}>
            {location.name.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={this.handleOpenInfo}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.locInfoBtn}
          >
            <Text style={styles.slideInfoLink}>
              {t('booking:infoLink')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  handleSelect = () => {
    const { location, onSelect } = this.props;

    if (location.available) {
      onSelect(location.reference);
    }
  };

  handleOpenInfo = () => {
    this.props.openInfo(this.props.location.reference);
  };
}

LocationSlide.propTypes = {
  t: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  openInfo: PropTypes.func.isRequired,
  location: PropTypes.object,
  isSelected: PropTypes.bool,
  isFirstItem: PropTypes.bool
};

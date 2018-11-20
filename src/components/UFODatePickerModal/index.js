import React, { PureComponent } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import moment from 'moment';

import styles, { calendarTheme, CALENDAR_WIDTH, MONTH_HEIGHT } from './styles';
import { values } from './../../utils/theme';

export default class UFODatePickerModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startPickedDate: null,
      endPickedDate: null
    };
  }

  render() {
    const {
      isVisible,
      onClose,
      ...calendarProps
    } = this.props;

    return (
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => false}
      >
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={values.BTN_OPACITY_DEFAULT}
              >
                <Text style={styles.closeBtn}>
                  {i18n.t('common:closeBtn')}
                </Text>
              </TouchableOpacity>
              <Text style={styles.headerLabel}>
                {i18n.t('common:calendarTitle')}
              </Text>
              <TouchableOpacity
                onPress={this.handleSave}
                activeOpacity={values.BTN_OPACITY_DEFAULT}
              >
                <Text style={styles.saveBtn}>
                  {i18n.t('common:saveBtn').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
            <CalendarList
              calendarWidth={CALENDAR_WIDTH}
              calendarHeight={MONTH_HEIGHT}
              theme={calendarTheme}
              onDayPress={this.handleDayPress}
              markingType="period"
              markedDates={this.getMarkedDates()}
              {...calendarProps}
            />
          </View>
        </View>
      </Modal>
    );
  }

  getMarkedDates = () => {
    const { startPickedDate, endPickedDate } = this.state;

    return {
      [startPickedDate]: { startingDay: true, color: 'green' },
      [endPickedDate]: { endingDay: true, color: 'green' }
    };
  };

  handleDayPress = ({ dateString }) => {
    const { startPickedDate } = this.state;

    if (!startPickedDate || moment(dateString).isBefore(startPickedDate)) {
      this.setState({
        startPickedDate: dateString,
        endPickedDate: dateString
      });

      return;
    }

    this.setState({endPickedDate: dateString});
  };

  handleSave = () => {

  };
}

UFODatePickerModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  calendarProps: PropTypes.shape({ ...CalendarList.PropTypes })
};

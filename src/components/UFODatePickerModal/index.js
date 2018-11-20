import React, { PureComponent } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import moment from 'moment';

import styles, {
  calendarTheme,
  CALENDAR_WIDTH,
  MONTH_HEIGHT,
  markedDaysTheme,
  forbiddenDaysTheme
} from './styles';
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
                onPress={this.handleClose}
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

  /**
    * @returns {Object}
    * @description Get dates with customizing styles
    */
  getMarkedDates = () => {
    const { startPickedDate, endPickedDate } = this.state;
    const dates = {};

    this.props.forbiddenDays.forEach(day => {
      dates[day] = { ...forbiddenDaysTheme };
    });

    if (!startPickedDate) {
      return dates;
    }

    if (!endPickedDate) {
      dates[startPickedDate] = {
        startingDay: true,
        endingDay: true,
        selected: true,
        ...markedDaysTheme
      };

      return dates;
    }

    const interimDate = moment(startPickedDate);

    while (!interimDate.isAfter(endPickedDate)) {
      const dateString = interimDate.format(values.DATE_STRING_FORMAT);
      dates[dateString] = {
        startingDay: dateString === startPickedDate,
        endingDay: dateString === endPickedDate,
        selected: true,
        ...markedDaysTheme
      };
      interimDate.add(1, 'days');
    }

    return dates;
  };

  /**
    * @param {string} dateString
    * @description Handling datepicker event
    */
  handleDayPress = ({ dateString }) => {
    if (this.props.forbiddenDays.includes(dateString)) {
      return;
    }

    const { startPickedDate } = this.state;

    if (startPickedDate && dateString === startPickedDate) {
      this.setState({
        startPickedDate: null,
        endPickedDate: null
      });
    }

    if (!startPickedDate || moment(dateString).isBefore(startPickedDate)) {
      this.setState({
        startPickedDate: dateString,
        endPickedDate: null
      });

      return;
    }

    this.setState({ endPickedDate: dateString });
  };

  /**
    * @description Saving picked dates (throw into onSubmit prop)
    */
  handleSave = () => {
    const { startPickedDate, endPickedDate } = this.state;
    const dateStart = startPickedDate;
    const dateEnd = endPickedDate || startPickedDate;

    const onSubmit = this.props.onSubmit;

    if (typeof onSubmit === 'function') {
      onSubmit(dateStart, dateEnd);
    }

    this.handleClose();
  };

  /**
    * @description Handling closing picker
    */
  handleClose = () => {
    this.setState({
      startPickedDate: null,
      endPickedDate: null
    });
    this.props.onClose();
  };
}

UFODatePickerModal.defaultProps = { forbiddenDays: [] };

UFODatePickerModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  forbiddenDays: PropTypes.array,
  calendarProps: PropTypes.shape({ ...CalendarList.PropTypes })
};

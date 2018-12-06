import React, { Component } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import moment from 'moment';
import Calendar from './components/Calendar';

import styles from './styles';
import { values } from './../../utils/theme';

export default class UFODatePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startPickedDate: null,
      endPickedDate: null
    };
  }

  render() {
    console.log('MAXDATE', this.props.maxPickedDate);
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
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
            <Calendar
              showDateRange={this.getShowDateRange()}
              selectedDateRange={this.getSelectedDateRange()}
              onDayPress={this.handleDayPress}
              datesInfo={this.props.calendarData}
            />
          </View>
        </View>
      </Modal>
    );
  }

  /**
    * @returns {Array}
    * @description Get array with dates range for rendering
    */
  getShowDateRange = () => {
    const { minPickedDate, maxPickedDate } = this.props;
    const range = [];

    if (minPickedDate) {
      const fallbackMaxDate = moment(minPickedDate).add(2, 'month').endOf('month').format(values.DATE_STRING_FORMAT);
      range.push(minPickedDate);
      maxPickedDate
        ? range.push(maxPickedDate)
        : range.push(fallbackMaxDate);
    }

    return range;
  };

  /**
    * @returns {Array}
    * @description Get array with selected dates [start, end]
    */
  getSelectedDateRange = () => {
    const { startPickedDate, endPickedDate } = this.state;
    const range = [];
    startPickedDate && range.push(startPickedDate);
    endPickedDate && startPickedDate && range.push(endPickedDate);

    return range;
  };

  /**
    * @param {string} dateString
    * @description Handling datepicker event
    */
  handleDayPress = dateString => {
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

UFODatePickerModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  calendarData: PropTypes.array,
  minPickedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  maxPickedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

import React, { PureComponent } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import moment from 'moment';
import Calendar from './components/Calendar';

import styles from './styles';
import { values } from './../../utils/theme';

export default class UFODatePickerModal extends PureComponent {
  constructor(props) {
    super(props);
    this.perPage = 3;
    this.state = {
      startPickedDate: null,
      endPickedDate: null,
      maxRangeDate: moment(props.minPickedDate)
        .add(this.perPage, 'month')
        .format(values.DATE_STRING_FORMAT)
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.startRental !== prevProps.startRental
      && moment(this.state.maxRangeDate).isBefore(this.props.startRental)
    ) {
      this.handleNextPage();
    }
  }

  render() {
    return !this.props.isVisible ? null : (
      <Modal
        transparent={true}
        visible={true}
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
              onNextPage={this.handleNextPage}
              onEndReachedThreshold={0.3}
            />
            {this.renderColorDescrBlock()}
          </View>
        </View>
      </Modal>
    );
  }

  renderColorDescrBlock = () => {
    return (
      <View style={styles.colorDescriptionBlock}>
        <View style={styles.row}>
          <View style={styles.row}>
            <View style={[ styles.colorDescriptionDot, styles.noAvailabilityDot ]} />
            <Text style={styles.colorDescriptionLabel}>
              - {i18n.t('booking:noAvailableColor')}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={[ styles.colorDescriptionDot, styles.highDemandDot ]} />
            <Text style={styles.colorDescriptionLabel}>
              - {i18n.t('booking:highDemandColor')}
            </Text>
          </View>
        </View>
        <Text style={styles.colorDescriptionNotes}>
          * {i18n.t('booking:calendarColorsNotes')}
        </Text>
      </View>
    );
  };

  /**
    * @returns {Array}
    * @description Get array with dates range for rendering
    */
  getShowDateRange = () => {
    const minDate = this.props.minPickedDate || moment().format(values.DATE_STRING_FORMAT);
    return [ minDate, this.state.maxRangeDate ];
  };

  /**
    * @returns {Array}
    * @description Get array with selected dates [start, end]
    */
  getSelectedDateRange = () => {
    const { startPickedDate, endPickedDate } = this.state;
    const { startRental, endRental } = this.props;
    const range = [];

    if (startPickedDate) {
      range.push(startPickedDate);
      endPickedDate && range.push(endPickedDate);
    } else if (startRental) {
      range.push(startRental);
      endRental && range.push(endRental);
    }

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
      endPickedDate: null,
      maxRangeDate: moment(this.props.minPickedDate)
        .add(this.perPage, 'month')
        .format(values.DATE_STRING_FORMAT)
    });
    this.props.onClose();
  };

  /*
   * @description Pagination handling
  */
  handleNextPage = () => {
    let maxRangeMoment = moment(this.state.maxRangeDate).add(this.perPage, 'month');

    if (maxRangeMoment.isAfter(this.props.maxPickedDate)) {
      maxRangeMoment = moment(this.props.maxPickedDate);
    }

    const maxRangeDate = maxRangeMoment.format(values.DATE_STRING_FORMAT);

    if (maxRangeDate !== this.state.maxRangeDate) {
      this.setState({ maxRangeDate });
    }
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
  ]),
  startRental: PropTypes.string,
  endRental: PropTypes.string
};

import React, { PureComponent } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import i18n from 'i18next';

import styles, { calendarTheme, CALENDAR_WIDTH, MONTH_HEIGHT } from './styles';
import { values } from './../../utils/theme';

LocaleConfig.locales['en'] = {
  monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
  dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  dayNamesShort: ['SU','M','TU','W','TH','F','SA']
};

LocaleConfig.defaultLocale = 'en';

export default class UFODatePickerModal extends PureComponent {
  render() {
    const {
      isVisible,
      ...calendarProps
    } = this.props;

    return (
      <Modal
        transparent={true}
        visible={true}
        onRequestClose={() => false}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPess={null}
          style={styles.wrapper}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPess={null}
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
                onPess={null}
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
              { ...calendarProps }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

UFODatePickerModal.propTypes = {

};

import { StyleSheet, Dimensions } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

const HORIZONTAL_INDENTS = 25;
const { width: SCREEN_WIDTH } = Dimensions.get('screen');
export const CALENDAR_WIDTH = SCREEN_WIDTH - HORIZONTAL_INDENTS * 2;
export const MONTH_HEIGHT = 340;

export const calendarTheme = {
  textDayFontFamily: textThemes.SP_LIGHT.fontFamily,
  textDayFontSize: 15,
  dayTextColor: colors.MAIN_COLOR,
  todayTextColor: colors.MAIN_COLOR,
  textDisabledColor: colors.TEXT_LIGHT_COLOR,
  monthTextColor: colors.TEXT_DEFAULT_COLOR,
  textMonthFontFamily: textThemes.SP_REGULAR.fontFamily,
  textMonthFontWeight: '400',
  textMonthFontSize: 17,
  textDayHeaderFontSize: 14,
  textSectionTitleColor: colors.MAIN_LIGHT_COLOR,
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  selectedDayTextColor: colors.BG_INVERT
};

export const markedDaysTheme = { color: colors.MAIN_COLOR };

export const forbiddenDaysTheme = { textColor: colors.ATTENTION_COLOR };

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)'
  },

  container: {
    flex: 1,
    backgroundColor: colors.BG_INVERT,
    marginHorizontal: HORIZONTAL_INDENTS,
    marginTop: 48,
    marginBottom: 36,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: colors.BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22
  },
  headerLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    color: colors.MAIN_COLOR,
    letterSpacing: 4
  },
  closeBtn: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    color: colors.TEXT_LIGHT_COLOR,
    textDecorationLine: 'underline',
    letterSpacing: 1.1
  },
  saveBtn: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    color: colors.MAIN_LIGHT_COLOR,
    textDecorationLine: 'underline',
    letterSpacing: 1.1
  }
});

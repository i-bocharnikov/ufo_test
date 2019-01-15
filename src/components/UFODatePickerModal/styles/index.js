import { StyleSheet, Platform } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

const HORIZONTAL_INDENTS = 25;

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
  },

  calendarList: {
    paddingHorizontal: 26,
    paddingTop: 8,
    paddingBottom: 16
  },

  monthTitle: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 17,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 20
  },

  monthContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },

  dayGap: { width: `${100 / 7}%` },

  dayContainer: {
    height: 48,
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingTop: 6
  },

  dayLabel: {
    ...textThemes.SP_LIGHT,
    fontSize: 15,
    color: colors.MAIN_COLOR
  },

  dayDisabledText: { color: colors.TEXT_LIGHT_COLOR },

  dayforbiddenText: { color: colors.ATTENTION_COLOR },

  dayPrice: {
    ...textThemes.SP_LIGHT,
    fontSize: 11,
    color: colors.MAIN_COLOR,
    marginTop: 6
  },

  weekLabelsContainer: { flexDirection: 'row' },

  weekLabel: {
    ...textThemes.SP_LIGHT,
    fontSize: 14,
    color: colors.MAIN_LIGHT_COLOR,
    height: 32,
    width: `${100 / 7}%`,
    alignItems: 'center'
  },

  selectedDay: { backgroundColor: colors.MAIN_LIGHT_COLOR },

  selectedFirstDay: {
    backgroundColor: colors.MAIN_COLOR,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },

  selectedLastDay: {
    backgroundColor: colors.MAIN_COLOR,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },

  selectedDayText: { color: colors.TEXT_INVERT_COLOR },

  emptyCalendarLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 18,
    color: colors.BORDER_COLOR,
    alignSelf: 'center',
    marginTop: '50%'
  },

  colorDescriptionBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: colors.BG_INVERT,
    borderTopWidth: 1,
    borderColor: colors.BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  colorDescriptionDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginRight: 4
  },

  noAvailabilityDot: { backgroundColor: '#f5222d' },

  highDemandDot: {
    marginLeft: 12,
    backgroundColor: '#faad14'
  },

  colorDescriptionLabel: {
    ...textThemes.SP_LIGHT,
    fontSize: 12,
    lineHeight: 12
  },

  colorDescriptionNotes: {
    ...textThemes.SP_LIGHT,
    fontSize: 12,
    marginTop: Platform.OS === 'ios' ? 6 : 4
  }
});

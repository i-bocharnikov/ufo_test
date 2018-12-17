import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

export const BOTTOM_PANEL_HEIGHT = 70;
export const LOCATION_SLIDE_WIDTH = 128;
export const SCREEN_HORIZONTAL_INDENTS = 25;

export default StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  wrapperBottomPadding: { paddingBottom: BOTTOM_PANEL_HEIGHT },

  headerSubtitleLabel: { lineHeight: 16 },

  headerSubtitleIcon: { fontSize: 16 },

  headerSubtitleSpaces: { letterSpacing: 12 },

  headerFutureStep: { opacity: 0.4 },

  headerPastStep: { color: colors.MAIN_LIGHT_COLOR },

  screenContainer: {
    backgroundColor: colors.BG_INVERT_TINT,
    paddingTop: 2
  },

  sectionTitle: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    letterSpacing: 4,
    fontSize: 13
  },

  sectionTitleIndents: {
    marginTop: 28,
    marginBottom: 10,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  screenHorizIndents: { marginHorizontal: SCREEN_HORIZONTAL_INDENTS },

  datePickTitle: { marginRight: 6 },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  emptyList: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_DEFAULT_COLOR,
    fontSize: 16,
    opacity: 0.6
  },

  locSlider: { paddingHorizontal: SCREEN_HORIZONTAL_INDENTS },

  locSlide: {
    width: 128,
    height: 125,
    backgroundColor: colors.BG_INVERT,
    marginVertical: 4
  },

  locSlideLeftSpace: { marginLeft: 15 },

  locSlideImg: {
    width: '100%',
    height: 60
  },

  locSlideLabel: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    textAlign: 'center',
    lineHeight: 16
  },

  locSlideLabelWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.BG_INVERT,
    borderWidth: 1.6,
    borderTopWidth: 0
  },

  choosenLocation: { borderColor: colors.BG_DEFAULT },

  locSlideMessage: {
    ...textThemes.SP_BOLD,
    fontSize: 10,
    color: colors.TEXT_INVERT_COLOR,
    position: 'absolute',
    zIndex: 1,
    top: 50,
    alignSelf: 'center',
    lineHeight: 20,
    backgroundColor: colors.ATTENTION_COLOR,
    paddingHorizontal: 8
  },

  blockShadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 1
  },

  blockShadowAndroidFix: {
    // android shadow fix for elements without borders
    borderWidth: 0
  },

  locInfoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },

  slideInfoLink: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    textDecorationLine: 'underline',
    color: colors.TEXT_LIGHT_COLOR,
    letterSpacing: 1
  },

  carSlider: {
    paddingHorizontal: SCREEN_HORIZONTAL_INDENTS,
    marginBottom: 26
  },

  carSlide: {
    width: 268,
    height: 170,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginVertical: 4,
    backgroundColor: colors.BG_INVERT,
    borderWidth: 1.6,
    borderColor: colors.BG_INVERT
  },

  carSlideLeftSpace: { marginLeft: 15 },

  carlideImg: {
    width: 210,
    height: 82,
    alignSelf: 'center'
  },

  carSlideLabel: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    letterSpacing: 0.7
  },

  carSlideLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  carSlidePrice: {
    ...textThemes.SP_LIGHT,
    color: colors.MAIN_LIGHT_COLOR,
    letterSpacing: 0.7,
    marginTop: 8
  },

  choosenCar: { borderColor: colors.BG_DEFAULT },

  tooltipLink: { textDecorationLine: 'underline' },

  dateTolltipicon: {
    color: colors.MAIN_COLOR,
    fontSize: 18
  },

  notAvailableCar: { opacity: 0.5 },

  opacityLabel: { opacity: 0.5 },

  bottomPanel: {
    position: 'absolute',
    height: BOTTOM_PANEL_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.BG_INVERT,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    elevation: 4
  },

  bottomPanelActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '33%',
    backgroundColor: colors.MAIN_COLOR
  },

  bottomPanelInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  bottomPanelActionTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 15
  },

  bottomPanelActionSubTitle: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12,
    marginTop: 6
  },

  bottomPanelPriceLabel: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    fontSize: 13,
    letterSpacing: 4,
    marginLeft: 26
  },

  bottomPanelPriceValue: {
    ...textThemes.SP_REGULAR,
    fontSize: 13,
    letterSpacing: 1.3,
    marginRight: 20
  },

  rollPickerSection: {
    flexDirection: 'row',
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    backgroundColor: colors.BG_INVERT
  },

  rollPicker: { marginVertical: 8 },

  rollPickerSeparatorWrapper: {
    height: '100%',
    width: 24,
    alignItems: 'center'
  },

  rollPickerSeparator: {
    flex: 1,
    width: 1,
    backgroundColor: colors.BORDER_COLOR
  },

  rollPickerSeparatorIcon: {
    position: 'absolute',
    top: '50%',
    marginTop: '-50%',
    paddingBottom: 2,
    backgroundColor: colors.BG_INVERT,
    color: colors.TEXT_LIGHT_COLOR,
    fontSize: 24
  },

  calendarViewBtn: {
    marginLeft: SCREEN_HORIZONTAL_INDENTS,
    marginTop: 18,
    marginBottom: 14
  },

  calendarViewBtnLabel: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_LIGHT_COLOR,
    fontSize: 13,
    textDecorationLine: 'underline',
    letterSpacing: 1.1
  },

  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    borderWidth: 1,
    borderColor: colors.MAIN_COLOR
  },

  actionBtnLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 15,
    letterSpacing: 1.25,
    color: colors.MAIN_COLOR
  },

  /* styles specific for StepPayScreen */
  screenPaymentContainer: {
    backgroundColor: colors.BG_INVERT,
    paddingTop: 2
  },

  infoSectionWrapper: {
    backgroundColor: colors.BG_INVERT_TINT,
    marginTop: 28,
    paddingTop: 16,
    paddingBottom: 48
  },

  infoBlock: {
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    backgroundColor: colors.BG_INVERT,
    paddingHorizontal: 24,
    paddingVertical: 20
  },

  infoBlockCarImg: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 120,
    height: 50
  },

  infoText: {
    ...textThemes.SP_LIGHT,
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 1.3,
    marginRight: 120
  },

  infoTitle: {
    ...textThemes.SP_BOLD,
    fontSize: 11,
    lineHeight: 28,
    letterSpacing: 3.5,
    color: colors.MAIN_COLOR
  },

  infoTitlePrice: {
    ...textThemes.SP_LIGHT,
    fontSize: 18,
    letterSpacing: 1.8,
    color: colors.TEXT_DEFAULT_COLOR,
    flex: 1,
    textAlign: 'right'
  },

  separateLine: {
    height: 1.6,
    backgroundColor: colors.MAIN_COLOR
  },

  separateLineInfoBlock: {
    marginTop: 16,
    marginBottom: 24
  },

  voucherInput: {
    flex: 1,
    height: 55
  },

  loyalityBlock: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.MAIN_COLOR
  },

  loyalityLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.9,
    flex: 1
  },

  loyalityTolltipIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 16,
    marginLeft: 8
  },

  voucherApplyBtn: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: colors.MAIN_COLOR
  },

  voucherApplyLabel: {
    ...textThemes.SP_LIGHT,
    fontSize: 12,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.9
  },

  scanCardBtn: { marginBottom: 28 },

  creditCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    paddingHorizontal: 12,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 4
  },

  selectedCreditCardItem: { borderColor: colors.SUCCESS_COLOR },

  creditCardNum: {
    ...textThemes.SP_REGULAR,
    fontSize: 14,
    color: colors.TEXT_LIGHT_COLOR,
    marginBottom: 4
  },

  creditCardType: {
    ...textThemes.SP_LIGHT,
    fontSize: 12,
    color: colors.TEXT_LIGHT_COLOR,
    textAlign: 'right'
  },

  radioCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.BG_INVERT
  },

  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.SUCCESS_COLOR
  },

  creditCardImg: {
    width: 36,
    height: 24,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginLeft: 10,
    borderRadius: 2
  },

  loyalityCheckbox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: colors.TEXT_INVERT_COLOR,
    marginRight: 12
  },

  loyalityIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 16
  }
});

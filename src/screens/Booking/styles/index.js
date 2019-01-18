import { StyleSheet, Platform } from 'react-native';

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
    paddingTop: 2,
    paddingBottom: 26
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
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
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

  carSlider: { paddingHorizontal: SCREEN_HORIZONTAL_INDENTS },

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
    fontSize: 14,
    /* strange behaviour with lineheight at android */
    lineHeight: Platform.OS === 'ios' ? 20 : 20.05,
    textAlign: 'center',
    letterSpacing: 0.6
  },

  bottomPanelActionSubTitle: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12,
    lineHeight: Platform.OS === 'ios' ? 13 : 16,
    letterSpacing: 0.3
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
    letterSpacing: 1.3
  },

  bottomPanelOriginValue: {
    textDecorationLine: 'line-through',
    color: colors.TEXT_LIGHT_COLOR,
    paddingRight: 4
  },

  bottomPanelMarketing: {
    ...textThemes.SP_LIGHT,
    color: colors.MAIN_LIGHT_COLOR,
    fontSize: 14,
    textAlign: 'right',
    position: 'absolute',
    top: 20,
    right: 0,
    minWidth: 180
  },

  bottomPanelOverlap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.BLOCKING_COLOR,
    justifyContent: 'center',
    paddingHorizontal: 14
  },

  bottomPanelNotAvailable: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 16,
    alignSelf: 'center'
  },

  bottomPanelAlternative: {
    ...textThemes.SP_REGULAR,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 1.2
  },

  bottomPanelActionOverlap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
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

  rollPickerSeparatorBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: '-50%'
  },

  rollPickerSeparatorIcon: {
    color: colors.TEXT_LIGHT_COLOR,
    fontSize: 24,
    height: 26,
    paddingBottom: 2,
    backgroundColor: colors.BG_INVERT
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

  infoBlockCarImgIndent: {
    marginRight: 120
  },

  infoText: {
    ...textThemes.SP_LIGHT,
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 1.3
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

  actionBtnDark: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    paddingHorizontal: 20,
    backgroundColor: colors.MAIN_COLOR
  },

  loyalityBtn: {
    height: 55,
    marginTop: 10
  },

  actionBtnDarkLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.9,
    flex: 1,
    textAlign: 'center'
  },

  loyalityTolltipIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 16,
    marginRight: 8
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
    borderRadius: 4
  },

  loyalityIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 28,
    marginLeft: 8
  }
});

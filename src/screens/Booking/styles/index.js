import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

export const BOTTOM_PANEL_HEIGHT = 70;
export const LOCATION_SLIDE_WIDTH = 128;
const SCREEN_HORIZONTAL_INDENTS = 25;

export default StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  wrapperBottomPadding: {
    paddingBottom: BOTTOM_PANEL_HEIGHT
  },

  headerSubtitleLabel: {
    lineHeight: 16
  },

  headerSubtitleIcon: {
    fontSize: 16
  },

  headerSubtitleSpaces: {
    letterSpacing: 12
  },

  headerFutureStep: {
    opacity: 0.4
  },

  screenContainer: {
    backgroundColor: colors.BG_INVERT_TINT,
    paddingTop: 12
  },

  sectionTitle: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    letterSpacing: 4,
    fontSize: 13
  },

  sectionTitleIndents: {
    marginTop: 20,
    marginBottom: 6,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  datePickTitle: {
    marginRight: 6
  },

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

  locSlider: {
    paddingVertical: 4,
    paddingHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  locSlide: {
    width: 128,
    height: 125,
    backgroundColor: colors.BG_INVERT
  },

  locSlideLeftSpace: {
    marginLeft: 15
  },

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

  choosenLocation: {
    borderColor: colors.BG_DEFAULT
  },

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

  slideShadow: {
    shadowOffset: {width: 0,  height: 2},
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1
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
    paddingVertical: 4,
    paddingHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  carSlide: {
    width: 268,
    height: 170,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.BG_INVERT,
    borderWidth: 1.6,
    borderColor: colors.BG_INVERT
  },

  carSlideLeftSpace: {
    marginLeft: 15
  },

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

  choosenCar: {
    borderColor: colors.BG_DEFAULT
  },

  tooltipLink: {
    textDecorationLine: 'underline'
  },

  dateTolltipicon: {
    color: colors.MAIN_COLOR,
    fontSize: 18
  },

  notAvailableCar: {
    opacity: 0.5
  }
});

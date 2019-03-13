import { StyleSheet, Dimensions } from 'react-native';
import { textThemes, colors } from './../../../utils/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const HEADER_HEIGHT = 54;
const HEADER_TOP_PADDING = 18;
const HEADER_SINGLE_HEIGHT = 64;
const HEADER_SIN_TOP_PADDING = 8;

const TITLE_FONT_SIZE = 28;
const ACTION_ICON_SIZE = 26;
const HEADER_ICON_PADDING = 16;

export const SUB_HEADER_HEIGHT = 48;
export const headerShadow = {
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 1,
  shadowColor: 'black',
  shadowOpacity: 0.4
};

export default StyleSheet.create({
  /* header styles */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: HEADER_HEIGHT,
    backgroundColor: colors.BG_DEFAULT,
    paddingHorizontal: HEADER_ICON_PADDING + ACTION_ICON_SIZE + 8,
    paddingTop: HEADER_TOP_PADDING
  },

  headerSingle: {
    height: HEADER_SINGLE_HEIGHT,
    paddingTop: HEADER_SIN_TOP_PADDING
  },

  title: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: TITLE_FONT_SIZE
  },

  actionIcon: {
    color: colors.TEXT_INVERT_COLOR,
    fontSize: ACTION_ICON_SIZE
  },

  leftBtn: {
    position: 'absolute',
    left: HEADER_ICON_PADDING,
    paddingTop: HEADER_TOP_PADDING
  },

  btnSingle: { paddingTop: HEADER_SIN_TOP_PADDING },

  rightBtn: {
    position: 'absolute',
    right: HEADER_ICON_PADDING,
    paddingTop: HEADER_TOP_PADDING
  },

  headerShadow,

  /* subheader styles */
  subHeader: {
    flexDirection: 'row',
    height: SUB_HEADER_HEIGHT,
    backgroundColor: colors.BG_DEFAULT,
    alignItems: 'center',
    paddingHorizontal: 24
  },

  subHeaderBasic: { justifyContent: 'center' },

  subHeaderSteps: { justifyContent: 'space-between' },

  subHeaderLabel: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12,
    letterSpacing: 0.6
  },

  subHeaderStep: { lineHeight: 16 },

  subHeaderPastStep: { color: colors.MAIN_LIGHT_COLOR },

  subHeaderFutureStep: { opacity: 0.4 },

  subHeaderStepIcon: { fontSize: 16 },

  /* sticky wrapper styles */
  bouncesHeaderBG: {
    position: 'absolute',
    height: SCREEN_HEIGHT / 2,
    top: -(SCREEN_HEIGHT / 2),
    left: 0,
    right: 0,
    backgroundColor: colors.BG_DEFAULT
  }
});

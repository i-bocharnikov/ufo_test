import { StyleSheet } from 'react-native';
import { textThemes, colors } from './../../../utils/theme';

const HEADER_HEIGHT = 54;
const HEADER_TOP_PADDING = 18;
const HEADER_SINGLE_HEIGHT = 64;
const HEADER_SIN_TOP_PADDING = 8;

const TITLE_FONT_SIZE = 28;
const ACTION_ICON_SIZE = 26;
const HEADER_ICON_PADDING = 16;

export default StyleSheet.create({
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

  btnSingle: {
    paddingTop: HEADER_SIN_TOP_PADDING
  },

  rightBtn: {
    position: 'absolute',
    right: HEADER_ICON_PADDING,
    paddingTop: HEADER_TOP_PADDING
  }
});
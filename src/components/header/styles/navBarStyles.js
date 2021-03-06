import { StyleSheet } from 'react-native';
import { textThemes, colors } from './../../../utils/theme';

export const HEADER_HEIGHT = 60;
export const TITLE_FONT_SIZE = 30;
export const ACTION_ICON_SIZE = 26;
const SUBHEADER_HEIGHT = 50;
const HEADER_TOP_PADDING = 18;

export default StyleSheet.create({
  wrapper: { flex: 1 },

  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: colors.BG_DEFAULT,
    paddingHorizontal: 25
  },

  headerShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowColor: 'black',
    shadowOpacity: 0.4,
    elevation: 4
  },

  container: { paddingTop: HEADER_HEIGHT },

  containerWithSubtitle: { paddingTop: HEADER_HEIGHT + SUBHEADER_HEIGHT },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  title: {
    ...textThemes.SP_BOLD,
    paddingTop: HEADER_TOP_PADDING,
    color: colors.TEXT_INVERT_COLOR,
    lineHeight: TITLE_FONT_SIZE
  },

  subHeader: {
    flexDirection: 'row',
    height: SUBHEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  subTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12
  },

  subTitleCenter: {
    flex: 1,
    textAlign: 'center'
  },

  actionIcon: { color: colors.TEXT_INVERT_COLOR },

  leftBtn: {
    position: 'absolute',
    left: 0,
    paddingTop: HEADER_TOP_PADDING
  },

  rightBtn: {
    position: 'absolute',
    right: 0,
    paddingTop: HEADER_TOP_PADDING
  }
});

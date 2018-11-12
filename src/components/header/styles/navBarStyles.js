import { StyleSheet } from 'react-native';
import { textThemes, colors } from './../../../utils/theme';

export const HEADER_HEIGHT = 60;
export const TITLE_FONT_SIZE = 30;
const SUBHEADER_HEIGHT = 50;

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },

  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: colors.BG_DEFAULT
  },

  scrollContainer: {
    paddingTop: HEADER_HEIGHT + SUBHEADER_HEIGHT
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  title: {
    ...textThemes.SP_BOLD,
    paddingTop: 18,
    color: colors.TEXT_INVERT_COLOR
  },

  subHeader: {
    flexDirection: 'row',
    height: SUBHEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },

  subTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12
  }
});

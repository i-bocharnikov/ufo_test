import { StyleSheet } from 'react-native';

export const BOTTOM_PANEL_HEIGHT = 70;

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },

  wrapperBottomPadding: {
    paddingBottom: BOTTOM_PANEL_HEIGHT
  },

  subTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  }
});

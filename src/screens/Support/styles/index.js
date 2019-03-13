import { StyleSheet, Platform } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

const HORIZONTAL_INDENTS = 24;
const TAG_HEIGHT = 25;

export default StyleSheet.create({
  tabWrapper: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  scrollContainer: { paddingTop: 16 },

  blockShadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 1
  },

  guideTagsContainer: { marginBottom: 20 },

  guideTagBtn: {
    height: TAG_HEIGHT,
    alignItems: 'center',
    borderRadius: TAG_HEIGHT / 2,
    paddingHorizontal: 16,
    backgroundColor: colors.BG_INVERT,
    marginRight: 10
  },

  guideTagBtnFirst: { marginLeft: HORIZONTAL_INDENTS },

  guideTagBtnLast: { marginRight: HORIZONTAL_INDENTS },

  guideTagLabel: {
    ...textThemes.SP_BOLD,
    color: colors.MAIN_COLOR,
    fontSize: 10,
    lineHeight: TAG_HEIGHT,
    letterSpacing: 0.36,
    marginTop: Platform.OS === 'ios' ? 1 : 0
  },

  guideTagBtnChosen: { backgroundColor: colors.MAIN_COLOR },

  guideTagLabelChosen: { color: colors.TEXT_INVERT_COLOR },

  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: HORIZONTAL_INDENTS,
    backgroundColor: colors.BG_INVERT,
    paddingVertical: 20,
    paddingHorizontal: 16
  },

  guideItemLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 14,
    lineHeight: 18,
    color: colors.MAIN_COLOR,
    letterSpacing: 0.5,
    flex: 1
  },

  guideItemIcon: {
    color: colors.TEXT_DEFAULT_COLOR,
    fontSize: 16,
    marginLeft: 8
  },

  guideContentWrapper: {
    backgroundColor: colors.BG_INVERT,
    paddingVertical: 20
  },

  guideMedia: {
    flex: 1,
    height: 240
  },

  guideTitle: {
    ...textThemes.SP_BOLD,
    fontSize: 13,
    lineHeight: 22,
    color: colors.MAIN_COLOR,
    letterSpacing: 4,
    marginHorizontal: HORIZONTAL_INDENTS,
    marginTop: 24,
    alignSelf: 'center',
    textAlign: 'center'
  },

  guideDescription: {
    ...textThemes.SP_REGULAR,
    lineHeight: 21,
    marginHorizontal: HORIZONTAL_INDENTS,
    marginTop: 20
  }
});

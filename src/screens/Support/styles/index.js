import { StyleSheet } from 'react-native';
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
    marginTop: 1
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
    paddingVertical: 16,
    paddingHorizontal: 12
  },

  guideItemLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 14,
    color: colors.MAIN_COLOR,
    letterSpacing: 0.5
  },

  guideItemIcon: {
    color: colors.TEXT_DEFAULT_COLOR,
    fontSize: 16
  }
});

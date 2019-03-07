import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

const HORIZONTAL_INDENTS = 24;

export default StyleSheet.create({
  tabWrapper: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  scrollContainer: {
    paddingTop: 32,
    paddingHorizontal: HORIZONTAL_INDENTS
  },
});

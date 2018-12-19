import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';
import { SCREEN_HORIZONTAL_INDENTS } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_DEFAULT
  },

  moonImg: {
    height: 50,
    width: 36
  },

  headerTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 25
  },

  headerSubTitle: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 25
  }
});

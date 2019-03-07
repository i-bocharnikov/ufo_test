import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../utils/theme';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.BG_DEFAULT,
    height: 48,
    paddingTop: 6
  },

  label: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 12,
    lineHeight: 12
  },

  indicator: {
    backgroundColor: colors.MAIN_LIGHT_COLOR,
    width: '24%',
    marginHorizontal: '8%',
    height: 5
  },

  tripleIndicator: {
    backgroundColor: colors.MAIN_LIGHT_COLOR,
    width: '16%',
    marginHorizontal: '5%',
    height: 5
  }
});

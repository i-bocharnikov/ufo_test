import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../utils/theme';
import { SUB_HEADER_HEIGHT, headerShadow } from './../../components/UFOHeader/styles';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.BG_DEFAULT,
    height: SUB_HEADER_HEIGHT,
    paddingTop: 6,
    ...headerShadow
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

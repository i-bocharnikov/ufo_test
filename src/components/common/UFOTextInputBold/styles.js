import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const ufoInputBoldStyles = {
  ...textThemes.SP_SEMIBOLD,
  fontSize: 28,
  height: 28,
  lineHeight: 28,
  padding: 0,
  letterSpacing: 1.2,
  backgroundColor: 'transparent'
};

export default StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.BG_INVERT,
    borderWidth: 1,
    borderColor: colors.BG_INVERT
  },

  input: { ...ufoInputBoldStyles },

  title: {
    ...textThemes.SP_LIGHT,
    fontSize: 17,
    color: colors.TEXT_LIGHT_COLOR,
    textAlign: 'center',
    letterSpacing: 1.2,
    marginBottom: 5
  },

  invalidBorder: { borderColor: colors.ATTENTION_COLOR },

  successBorder: { borderColor: colors.SUCCESS_COLOR }
});

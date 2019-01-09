import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const ufoInputStyles = {
  ...textThemes.SP_LIGHT,
  height: 50,
  fontSize: 17,
  backgroundColor: colors.BG_INVERT
};

export default StyleSheet.create({
  input: {
    flex: 1,
    ...ufoInputStyles,
    backgroundColor: 'transparent'
  },

  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 12,
    backgroundColor: colors.BG_INVERT
  },

  invalidBorder: {
    borderWidth: 1,
    borderColor: colors.ATTENTION_COLOR
  },

  successBorder: {
    borderWidth: 1,
    borderColor: colors.SUCCESS_COLOR
  },

  errorLabel: {
    ...textThemes.SP_LIGHT,
    color: colors.ATTENTION_COLOR,
    fontSize: 15,
    lineHeight: 19,
    marginTop: 8,
    marginLeft: 20,
    marginRight: 12
  }
});

import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';
import { SCREEN_HORIZONTAL_INDENTS } from './index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_DEFAULT,
    paddingHorizontal: '16%',
    paddingTop: 32
  },

  moonImg: {
    height: 36,
    width: 48,
    marginBottom: 48
  },

  headerTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 25,
    lineHeight: 34,
    letterSpacing: 0.48
  },

  headerSubTitle: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 25,
    lineHeight: 34,
    letterSpacing: 0.48,
    marginBottom: 24
  },

  descriptionText: {
    ...textThemes.SP_REGULAR,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.28,
    minHeight: '28%'
  },

  textShadow: {
    textShadowOffset: { height: 1, width: 0 },
    textShadowColor: 'rgba(0,0,0,0.32)',
    textShadowRadius: 1
  },

  linkedText: { textDecorationLine: 'underline' },

  nextBtn: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.MAIN_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 1
  },

  nextBtnLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 15,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 1.24
  }
});

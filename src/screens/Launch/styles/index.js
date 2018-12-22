import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  sliderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  logoBigImg: {
    width: 200,
    height: 96,
    resizeMode: 'contain',
    marginTop: '22%'
  },

  launchTitle: {
    ...textThemes.SP_BOLD,
    fontSize: 30,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.48,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: '22%'
  },

  logoSmallImg: {
    width: 55,
    height: 36,
    resizeMode: 'contain',
    marginTop: '12%'
  },

  slideTextBlock: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 36,
    paddingBottom: 60
  },

  slideTitle: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 25,
    letterSpacing: 0.4,
    textAlign: 'center'
  },

  slideSubTitle: {
    ...textThemes.SP_REGULAR,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.6,
    textAlign: 'center',
    marginVertical: 14
  },

  slideText: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    textAlign: 'center',
    lineHeight: 20
  },

  skipBtn: {
    position: 'absolute',
    right: 20,
    top: 20
  },

  skipBtnLabel: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    letterSpacing: 0.26,
    textDecorationLine: 'underline'
  },

  sliderIndicator: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: 50
  },

  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.BORDER_COLOR
  },

  sliderActiveDot: { backgroundColor: colors.MAIN_LIGHT_COLOR },

  nextBtnLabel: {
    ...textThemes.SP_BOLD,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 15,
    letterSpacing: 1.24
  },

  nextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '86%',
    alignSelf: 'center',
    backgroundColor: colors.MAIN_COLOR,
    marginBottom: -12,
    marginTop: 24
  }
});

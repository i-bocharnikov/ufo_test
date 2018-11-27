import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';
import { SCREEN_HORIZONTAL_INDENTS } from './index';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.BG_INVERT,
    paddingTop: 30,
    paddingBottom: 32
  },

  slideWrapper: {
    flex: 1,
    height: 175,
    paddingHorizontal: SCREEN_HORIZONTAL_INDENTS,
    alignItems: 'center',
    justifyContent: 'center'
  },

  slideImg: {
    width: '100%',
    height: '100%'
  },

  sliderPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 28
  },

  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.BORDER_COLOR,
    marginHorizontal: 6
  },

  sliderDotActive: { backgroundColor: colors.MAIN_LIGHT_COLOR },

  separateLine: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  commonText: {
    ...textThemes.SP_LIGHT,
    fontSize: 13
  },

  commonBoldText: {
    ...textThemes.SP_BOLD,
    fontSize: 13
  },

  descriptionTitle: {
    textAlign: 'center',
    marginTop: 32,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  descriptionSubTitle: {
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  descriptionText: {
    lineHeight: 19,
    marginVertical: 26,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    textAlign: 'justify'
  },

  descriptionFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 26,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    marginVertical: 12
  },

  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: colors.BORDER_COLOR,
    marginHorizontal: 12
  },

  priceMessage: {
    ...textThemes.SP_REGULAR,
    fontSize: 20,
    color: colors.MAIN_LIGHT_COLOR,
    textAlign: 'center',
    marginTop: 28,
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS
  },

  selectBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SCREEN_HORIZONTAL_INDENTS,
    marginTop: 28,
    borderWidth: 1,
    borderColor: colors.MAIN_COLOR
  },

  selectBtnLabel: {
    ...textThemes.SP_REGULAR,
    fontSize: 15,
    letterSpacing: 1.25,
    color: colors.MAIN_COLOR
  },

  selectbtnIcon: {
    fontSize: 32,
    color: colors.MAIN_COLOR,
    marginRight: 8
  },

  closeBtn: {
    alignSelf: 'center',
    marginTop: 28
  },

  closeBtnLabel: {
    ...textThemes.SP_BOLD,
    fontSize: 15,
    color: colors.TEXT_LIGHT_COLOR,
    textDecorationLine: 'underline'
  }
});
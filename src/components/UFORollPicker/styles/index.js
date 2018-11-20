import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const ITEM_HEIGHT = 32;
export const DEFAULT_FONT_SIZE = 12;
export const SELECTED_FONT_SIZE = 19;

export default StyleSheet.create({
  wrapper: {
    height: ITEM_HEIGHT * 3,
    flex: 1
  },

  row: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },

  rowLabel: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_LIGHT_COLOR,
    letterSpacing: 1.4
  }
});

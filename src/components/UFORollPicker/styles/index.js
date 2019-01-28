import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

export const ITEM_HEIGHT = 32;
export const DEFAULT_TEXT_SCALE = 1;
export const SELECTED_TEXT_SCALE = 1.4;

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
    color: colors.MAIN_COLOR,
    letterSpacing: 1.4,
    fontSize: 12
  },

  disabledRow: { color: colors.ATTENTION_COLOR }
});

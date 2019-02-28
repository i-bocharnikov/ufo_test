import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';
import { ACTION_BAR_HEIGHT } from './../../../components/UFOActionBar';
import { ufoInputStyles } from './../../../components/common';

const GAP_BETWEEN = 9;

export const googleInputStyles = StyleSheet.create({
  container: {
    flex: 0,
    marginLeft: 24,
    marginRight: 24
  },

  textInputContainer: {
    height: 'auto',
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 32,
    borderTopWidth: 0
  },

  textInput: {
    ...ufoInputStyles,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0,
    paddingLeft: 20,
    paddingRight: 12
  },

  separator: { backgroundColor: 'transparent' },

  row: {
    backgroundColor: colors.BG_INVERT,
    marginLeft: 0,
    marginRight: 0
  }
});

export default StyleSheet.create({
  scrollWrapper: { flex: 1 },

  bodyWrapper: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: ACTION_BAR_HEIGHT
  },

  inputBlock: { marginBottom: GAP_BETWEEN },

  cardsBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.BG_INVERT,
    paddingVertical: 20
  },

  leftGap: { marginLeft: GAP_BETWEEN },

  topGap: { marginTop: GAP_BETWEEN },

  cardPickerImg: {
    width: 88,
    height: 68,
    resizeMode: 'contain',
    marginBottom: 4
  },

  cardPickerLabel: {
    ...textThemes.SP_REGULAR,
    lineHeight: 19.1,
    textAlign: 'center',
    marginTop: 8
  },

  cardThumb: {
    width: 82,
    height: 46,
    marginBottom: 1
  },

  registrationStatus: {
    ...textThemes.SP_REGULAR,
    lineHeight: 18,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: colors.BG_INVERT
  },

  referalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    paddingHorizontal: 24,
    backgroundColor: colors.BG_INVERT
  },

  referalLabel: {
    ...textThemes.SP_LIGHT,
    fontSize: 17,
    flex: 1
  },

  referalImg: {
    height: 35,
    width: 28,
    resizeMode: 'contain',
    marginLeft: 8
  },

  inputIcon: {
    fontSize: 24,
    marginLeft: 8,
    color: colors.SUCCESS_COLOR
  },

  cardIcon: {
    position: 'absolute',
    marginLeft: 0,
    top: 8,
    right: 12
  },

  cardsWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 24,
    marginBottom: 100
  },

  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  cardsPreviewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  inputMiles: { marginTop: GAP_BETWEEN },

  invoiceInputsWrapper: {
    paddingHorizontal: 24,
    paddingBottom: ACTION_BAR_HEIGHT
  }
});

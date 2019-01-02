import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

const GAP_BETWEEN = 9;

export default StyleSheet.create({
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32
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

  cardCameraLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 20,
    textAlign: 'center',
    color: colors.TEXT_INVERT_COLOR,
    paddingHorizontal: 10,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },

  cardCameraBackground: { opacity: 0.3 },

  inputMiles: { marginTop: GAP_BETWEEN }
});

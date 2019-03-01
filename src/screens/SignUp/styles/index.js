import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';
import { ufoInputStyles } from './../../../components/common';

export default StyleSheet.create({
  tabWrapper: {
    flex: 1
  },

  container: {
    flex: 1,
    backgroundColor: colors.BG_INVERT_TINT
  },

  scrollContainer: {
    paddingTop: 32,
    paddingHorizontal: 24
  },

  row: {
    flexDirection: 'row'
  },

  blockShadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 1
  },

  infoPreviewBlock: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.BG_INVERT,
    marginBottom: 18
  },

  infoPreviewIcon: {
    position: 'absolute',
    right: 16,
    top: 10,
    fontSize: 20,
    color: colors.SUCCESS_COLOR
  },

  previewEditLabel: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 15,
    color: colors.TEXT_LIGHT_COLOR,
    letterSpacing: 1.2,
    textDecorationLine: 'underline',
    position: 'absolute',
    right: 16,
    bottom: 16
  },

  infoPreviewTitle: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 20,
    color: colors.MAIN_COLOR,
    letterSpacing: 0.8,
    marginTop: 12
  },

  infoPreviewItem: {
    ...textThemes.SP_LIGHT,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 1.4,
    marginTop: 10,
    marginBottom: 2,
    marginRight: 32
  },

  cardPickerBlock: {
    flex: 1,
    height: 164,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.BG_INVERT,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 18
  },

  cardPickerBlockIndent: {
    marginRight: 4
  },

  cardPickerImg: {
    height: 52,
    resizeMode: 'contain',
    marginBottom: 2,
    marginTop: 10
  },

  cardPickerLabel: {
    ...textThemes.SP_REGULAR,
    fontSize: 17,
    letterSpacing: 1.6,
    textAlign: 'center'
  },

  cardPickerEditPosition: {
    right: 4,
    bottom: 4
  },

  cardThumb: {
    width: 84,
    height: 42,
    marginBottom: 2
  }
});

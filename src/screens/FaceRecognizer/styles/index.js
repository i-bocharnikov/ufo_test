import { StyleSheet } from 'react-native';

import { colors, textThemes } from './../../../utils/theme';

export default StyleSheet.create({
  container: {
    flex: 1
  },

  faceArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.MAIN_LIGHT_COLOR
  },

  actionPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row'
  },

  actionBtn: {
    flex: 1,
    backgroundColor: colors.MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },

  actionLabel: {
    ...textThemes.SP_LIGHT,
    color: colors.TEXT_INVERT_COLOR,
    fontSize: 18
  },

  actionBtnSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: colors.BG_DEFAULT
  },

  capturedImage: {
    width: '100%',
    height: '100%'
  },

  actionBtnDisabled: {
    backgroundColor: colors.BG_DEFAULT
  }
});

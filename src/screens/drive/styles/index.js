import { StyleSheet } from 'react-native';
import { dims, colors } from './../../../utils/global';

/* using raw style object because specific of UFOText_old not allow to use StyleSheet.create */
export default {
  content: {
    paddingTop: dims.CONTENT_PADDING_TOP,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL
  },

  instructionContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: colors.CARD_BACKGROUND.string(),
    borderRadius: 8,
    padding: 20
  },

  instructionRow: { paddingTop: 5 },

  rentalsWrapper: { paddingTop: dims.CONTENT_PADDING_TOP },

  driveWrapper: {
    paddingTop: dims.CONTENT_PADDING_TOP,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center'
  }
};

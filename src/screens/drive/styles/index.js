import { StyleSheet, Dimensions } from 'react-native';
import { dims, colors } from './../../../utils/global';

const DRIVE_CARD_WIDTH = Dimensions.get('window').width / 1.5;
const DRIVE_CARD_HEIGHT = DRIVE_CARD_WIDTH / 2;

export default StyleSheet.create({
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
  },

  /* drive card styles */
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.CARD_BACKGROUND.string(),
    borderRadius: 8
  },

  carImg: {
    width: DRIVE_CARD_WIDTH,
    height: DRIVE_CARD_HEIGHT
  },

  startTimeLabel: { marginTop: 10 },

  editRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 6,
    marginRight: 4
  },

  editLabel: {
    fontSize: 16,
    lineHeight: 20
  },

  editicon: {
    fontSize: 20,
    marginLeft: 4,
    color: colors.TEXT.string()
  }
});

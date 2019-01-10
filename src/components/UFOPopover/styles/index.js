import { StyleSheet } from 'react-native';
import { colors, textThemes } from './../../../utils/theme';

const DEFAULT_BOTTOM_INDENT = 100;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: DEFAULT_BOTTOM_INDENT,
    alignSelf: 'center',
    zIndex: 999,
    maxWidth: 280,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },

  message: {
    ...textThemes.SP_LIGHT,
    fontSize: 13,
    lineHeight: 15
  },

  titleRow: {
    flexDirection: 'row',
    marginBottom: 5
  },

  title: {
    ...textThemes.SP_BOLD,
    fontSize: 14,
    lineHeight: 15,
    paddingTop: 2
  },

  icon: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 2
  },

  gestureWrapper: { flex: 1 }
});

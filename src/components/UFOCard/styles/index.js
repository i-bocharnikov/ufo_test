import { StyleSheet } from 'react-native';

const CARD_RADIUS = 8;

export default StyleSheet.create({
  topContainer: {
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS
  },

  bottomContainer: {
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS
  },

  singleContainer: { borderRadius: CARD_RADIUS },

  media: {
    flex: 1,
    height: 250,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS
  },

  cardContainer: {
    flexWrap: 'nowrap',
    marginVertical: 5,
    marginHorizontal: 2,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3
  },

  /* styles that replace native base */
  cardItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 17
  },

  cardItemBody: {
    paddingVertical: -5,
    paddingHorizontal: -5
  },

  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
    flex: 1
  },

  body: {
    alignSelf: 'center',
    flex: 1,
    marginLeft: 10,
    alignItems: null
  },

  title: { marginBottom: 8 }
});

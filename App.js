import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Container, Header, Content, Button, Text, Left, Body, Title, Right, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import { connect } from "react-redux";

import PlaceInput from "./src/components/PlaceInput/PlaceInput";
import PlaceList from "./src/components/PlaceList/PlaceList";
import PlaceDetail from "./src/components/PlaceDetail/PlaceDetail";
import {
  addPlace,
  deletePlace,
  selectPlace,
  deselectPlace
} from "./src/store/actions/index";

class App extends Component {
  placeAddedHandler = placeName => {
    this.props.onAddPlace(placeName);
  };

  placeDeletedHandler = () => {
    this.props.onDeletePlace();
  };

  modalClosedHandler = () => {
    this.props.onDeselectPlace();
  };

  placeSelectedHandler = key => {
    this.props.onSelectPlace(key);
  };

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Header >
            <Left />
            <Body>
              <Title>UFODRIVE</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Button>
              <Text>Click Me!</Text>
            </Button>
            <View style={styles.container}>
              <PlaceDetail
                selectedPlace={this.props.selectedPlace}
                onItemDeleted={this.placeDeletedHandler}
                onModalClosed={this.modalClosedHandler}
              />
              <PlaceInput onPlaceAdded={this.placeAddedHandler} />
              <PlaceList
                places={this.props.places}
                onItemSelected={this.placeSelectedHandler}
              />
            </View>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});

const mapStateToProps = state => {
  return {
    places: state.places.places,
    selectedPlace: state.places.selectedPlace
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: name => dispatch(addPlace(name)),
    onDeletePlace: () => dispatch(deletePlace()),
    onSelectPlace: key => dispatch(selectPlace(key)),
    onDeselectPlace: () => dispatch(deselectPlace())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from 'native-base'


class UFOContainer extends Component {
    render() {
        return (
            <Container>{this.props.children}</Container>
        );
    }
}

UFOContainer.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
};


export default UFOContainer;
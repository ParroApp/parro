import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Recorder from '../components/Recorder';
import Analytics from '../components/Analytics';
import Navbar from '../components/Navbar';
import {Route} from 'react-router-dom'
import Login from '../components/Login';
import Register from '../components/Register';
import Behavioral from '../components/Behavioral';


class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);

  }
  modalOpen() {
    console.log('OPEN');
    this.setState({modal: true})
  }
  modalClose() {
    console.log('close modal');
    this.setState({modal: false})
  }
  render() {
    console.log('HI!!', this.props);
    return (
      <div>
        <Navbar {...this.props} modalOpen={this.modalOpen} modal={this.state.modal}/>
        {this.state.modal && <Recorder modalClose={this.modalClose} modal={this.state.modal}/>}
      </div>
    );
  }
};

AppContainer.propTypes = {
    name: PropTypes.string,
};
const mapStateToProps = (state) => {
  return {
    name: state.name
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);

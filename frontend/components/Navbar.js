import PropTypes from 'prop-types';
import React from 'react';
import Title from '../components/Title';
import { Redirect } from 'react-router-dom'

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.end = this.end.bind(this);
  }
  end() {
    console.log('yoyoyoyoyoyo');
    // <Redirect to="/end"/>
    this.props.history.push('/end');
  }
  render() {
  return(
    <div>
      <nav className="navbar">
            <div className="navbar-brand">
              <a className="navbar-item is-large">
                <img src="/assets/img/parro.png" alt="Parro: speech practice program" href="https://github.com/coreymason/angelhack2017" width="150" height="28"/>
              </a>
            </div>

            <div id="navMenuExample" className="navbar-menu">
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="field is-grouped">
                    <p className="control">
                      <a className="button is-danger"
                        onClick={this.end}
                        >
                        <span>End</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </nav>
    </div>
  )
}
};

export default Navbar;

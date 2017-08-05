import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  // onSubmit(event) {
  //   event.preventDefault();
  //   // axios.post("https://morning-badlands-13664.herokuapp.com/login", {username: this.state.username, password: this.state.password})
  //   // .then(resp => {
  //   //   if(resp.status === 200) {
  //   //     console.log('success', resp);
  //   //     this.props.history.push('/home')
  //   //   } else {
  //   //     console.log('fail', resp);
  //   //   }
  //   // })
  //   // .catch(function (error) {
  //   //   console.log(error);
  //   // });
  //
  //   this.props.history.push('/home')
  //   this.setState({ username: '', password: '' })
  // }

  render() {
    return (
      <div className="login-page">
        <div className="login-wrapper">
        <h2>Login</h2>
            <p>Username</p>
            <input type="text" name="username" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/>
            <p>Password</p>
            <input type="password" name="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
            <Link to='/home'>
              <button className="blue-button">Login</button>
            </Link>
            <Link to='/register'>
              <button className="blue-button">Register</button>
            </Link>
        </div>
      </div>
    );
  }
}

export default Login;

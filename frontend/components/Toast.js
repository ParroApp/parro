import React from 'react';

class Toast extends React.Component {
constructor(props) {
  super(props);

}
render() {
  return(
    <div style={{width: '40%', position: 'absolute', right: '0%', zIndex: '10'}} className="notification is-info">
      <button onClick={this.props.close} className="delete"></button>
      {this.props.msg}
    </div>
  )
  }
}
export default Toast;

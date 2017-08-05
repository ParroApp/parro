import React from 'react';

class Timer extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    minutes: this.props.time,
    seconds: 0,
    interval: ''
  }

  this.decrement = this.decrement.bind(this);
}

componentDidMount() {
  this.setState({
    interval: setInterval(this.decrement, 1000)

  });
}

componentWillReceiveProps(nextProps) {
  console.log(nextProps);
  if (nextProps.time !== this.state.minutes) {
    clearInterval(this.state.interval);
    this.setState({
      minutes: nextProps.time,
      seconds: 0,
      interval: ''
    }, () => {
      this.setState({
        interval: setInterval(this.decrement, 1000)
      });
    });
  }
}

componentWillUnmount() {
  clearInterval(this.state.interval);
}

decrement() {
  if (this.state.minutes === 0 && this.state.seconds === 0) {
    clearInterval(this.state.interval);
    this.props.timerEnd();
    // alert('time is up!')
  } else if (this.state.seconds === 0) {
    this.setState({
      minutes: this.state.minutes - 1,
      seconds: 59
    })
  } else {
    this.setState({
      seconds: this.state.seconds - 1
    })
  }

}
render() {
  return(
    <div>
      <b>
        <strong style={{color: 'red'}} className="title is-2">{this.state.minutes}:{((this.state.seconds + '').length === 1) ? '0' + this.state.seconds : this.state.seconds}</strong>
      </b>
    </div>
  )
  }
}
export default Timer;

import React from 'react';
import Navbar from './Navbar';
import TypeWriter from 'react-typewriter';
import Code from './Code';
import Toast from './Toast';
import Timer from './Timer';
var axios = require('axios');

import { captureUserMedia, takePhoto, uploadImage, uploadAudio } from './AppUtils';
import RecordRTC from 'recordrtc';
const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);



class Technical extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intro: true,
      recordAudio: '',
      doneTyping: false,
      isRecording: false,
      isBotAsking: true,
      techQ1: null,
      techQ2: null,
      minTime: 0,
      secTime: 0,
      questionId: null,
      questionNumber: 1,
      toast: false,
      toastMessage: null,
      questions: [],
      curQ: true,
      curQuestionID: '',
      notLastQ: true,
      recording: false,
      minutes: 15,
      seconds: 0,
      interval: ''
    }
    this.makeMessage = this.makeMessage.bind(this);
    this.closeToast = this.closeToast.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.goToQuestions = this.goToQuestions.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  componentDidMount() {
    // captureUserMedia((stream) => {
    //   this.setState({ stream: stream, src: window.URL.createObjectURL(stream) });
    // });

    this.setState({
      interval: setInterval(this.decrement, 1000)
    });


    axios.get('/questions')
    .then((resp) => {
      this.setState({questions: resp.data, curQuestionID: resp.data[0]._id})
		})
    .catch(err => {
      console.log(err);
    })

    setTimeout(() => {
      this.nextQuestion()
    }, 900000)
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
  nextQuestion() {
    // SEND THE RESPONSE
    // KILL THE TIMER
    this.setState({curQ: false, notLastQ: false, minutes: 30, seconds: 0})
    // setTimeout(() => {
    //
    // }, 900000 * 2)
  }
  goToQuestions() {
    // this.props.history.push("/question");
    window.location = '/question';
  }
  handleClick() {
    if (!this.state.recording) {
      captureUserMedia((stream) => {
        this.setState({ stream: stream, src: window.URL.createObjectURL(stream) });
        var recordAudio = RecordRTC(stream, {
          recorderType: StereoAudioRecorder,
          mimeType: 'audio/wav'
        });
        recordAudio.startRecording();
        this.setState({
          recordAudio: recordAudio
        });
      });

      setTimeout(() => {
        console.log('STATE', this.state);
        this.state.recordAudio.stopRecording(() => {
          var formData = new FormData();
          formData.append('audio', this.state.recordAudio.getBlob());

          axios.post('/apiai', formData)
          .then(function(res) {
            console.log(res);
          })
          .catch(function(err) {
            console.log('ERROR', err);
          });
        });
        this.state.stream.getVideoTracks().forEach(function(track) {
          track.stop();
        });
        this.setState({
          recording: false
        })
      }, 10000)
    }
    this.setState({
      recording: !this.state.recording
    });
  }
  makeMessage(message) {
    var msg = message
    console.log('MESSAGE', msg);
    if (!msg.success) {
      this.setState({toast: true, toastMessage: msg.data.message})
    }
  }
  closeToast() {
    this.setState({toast: false})
  }
  render() {
    console.log(this.state);
    return(
      <div className="container is-fluid" onKeyPress={(e) => { console.log(e); }}>
        <Navbar {...this.props}/>
        <div style={{height: '30px', width: '100%'}}></div>
        {
          this.state.toast ? (<Toast msg={this.state.toastMessage} close={this.closeToast}/>) : null
        }
        {
          this.state.curQ ?
          <div>
            <div className="content">
              <p className="title is-2">Question #1</p>
              <p className="subtitle is-4">Given a string, you need to reverse the
                order of characters in each word within a sentence while still preserving whitespace and initial word order.</p>
              </div>
            <Code makeMessage={this.makeMessage} questionId="597dc6d1a2340df255b085aa"/>
            </div>
            :
            <div>
              <div className="content">
                <p className="title is-2">Question #2</p>
                <p className="subtitle is-4">Given a string S, you are allowed to convert it to a palindrome
                  by adding characters in front of it. Find and return the shortest palindrome you can find by performing
                  this transformation.</p>
                </div>
            <Code makeMessage={this.makeMessage} questionId="597dc6b7a2340df255b085a9"/>
            </div>
        }
        <div style={{height: '30px', width: '100%'}}></div>



        <nav className="level">

          <div className="level-left">
            <div className="level-item">
              {
                this.state.notLastQ ?
                (<div style={{display: 'flex', flexDirection: 'row'}}>
                  <button style={{right: '0'}} className="button is-warning" onClick={(e) => { e.preventDefault(); this.handleClick();}}>Press here to ask a question</button>
                  <button className="Rec" onClick={this.nextQuestion} style={(!this.state.recording)?styles.notrec:styles.rec} ></button>
                  <div style={{width: '5px', height: '1px'}}></div>
                  <button onClick={this.nextQuestion} style={{right: '0'}} className="button is-info">
                    <span className="icon">
                      <i className="fa fa-angle-right"></i>
                    </span>
                    <span>Next Question</span>
                  </button>
                </div>
              ) :
              (<div style={{display: 'flex', flexDirection: 'row'}}>
                <button style={{right: '0'}} className="button is-warning" onClick={(e) => {e.preventDefault(); this.handleClick(); }}>Press here to ask a question</button>
                <div style={{width: '5px', height: '1px'}}></div>
                <button className="Rec" onClick={this.nextQuestion} style={(!this.state.recording)?styles.notrec:styles.rec} ></button>
                <button onClick={this.goToQuestions} className="button is-success">
                  <span className="icon">
                    <i className="fa fa-smile-o"></i>
                  </span>
                  <span>I'm done!</span>
                </button>
              </div>
            )
          }
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div>
                <b>
                  <strong style={{color: 'red'}} className="title is-2">{this.state.minutes}:{((this.state.seconds + '').length === 1) ? '0' + this.state.seconds : this.state.seconds}</strong>
                </b>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

const styles = {
  'rec': {
  	'animationName': 'pulse',
  	'animationDuration': '1.5s',
  	'animationIterationCount': 'infinite',
  	'animationTimingFunction': 'linear',
    width: '25px',
  	height: '25px',
  	'fontSize': 0,
  	'backgroundColor': 'red',
  	border: 0,
  	'borderRadius': '35px',
  	margin: '5px',
    marginBottom: '10px',
    marginRight: '12px',
    marginLeft: '12px',
  	outline: 'none'
  },
  'notrec': {
  	display: 'none'
  }
}

export default Technical;

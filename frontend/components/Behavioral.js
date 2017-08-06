import React from 'react';
import Navbar from './Navbar';
import TypeWriter from 'react-typewriter';
import Timer from './Timer';
import axios from 'axios';
import { captureUserMedia, takePhoto, uploadImage, uploadAudio, mergeAndAnalyze } from './AppUtils';
import RecordRTC from 'recordrtc';
const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
 const queryString = require('query-string');
const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import speak from './Speak';
import ParroBot from './ParroBot';


// show parro first, if current status === visited , show landing page
// if current status === behavioral, show behavioral
class Behavioral extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // if (!hasGetUserMedia) {
    //   this.props.redirect('/unsupported');
    //     alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
    //   return;
    // }

    // Verify sid in query string.
    const query = queryString.parse(this.props.location.search);
    this.props.getAndVerifySession(query.sid);
  }

  componentDidMount() {
    // BUILDUP
    // The Web Speech API may mount without its voices loaded, making any
    // on-mount speech fail.
    window.speechSynthesis.onvoiceschanged = () => {
      this.forceUpdate()
    };
  }

  componentWillUnmount() {
    // TEARDOWN
    // We need to do unmount cleanup, to ensure that our queue is emptied
    // when the component is removed.
    window.speechSynthesis.cancel();
  }

  componentWillReceiveProps(nextProps) {
    console.log('RECEIVING PROPS', nextProps);
    if (nextProps.session.status === 'visited') { // Have not started
      // captureUserMedia((stream) => {
      //   this.setState({ stream: stream, src: window.URL.createObjectURL(stream) });
      // });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // We also need to decide when to invoke the speech method. This was
    // hooked into our component lifecycle automatically, but no longer is.
    if (prevProps.speak.message !== this.props.speak.message && this.props.speak.message) {
      speak(this.props.speak.message);
    }
  }


  startRecordVideo() {
    // start recording video
    console.log('start video recording');
    var recordVideo = RecordRTC(this.state.stream, {
      type: 'video',
      mimeType: 'video/webm',
      bitsPerSecond: 128000
    });
    recordVideo.startRecording();
    var videoElement = document.querySelector('video');
    var intervalId = setInterval(() => {
      var photo = takePhoto(videoElement);
      uploadImage(photo, this.state.userId);
    }, 10000)//333)

    // stores state
    this.setState({
      recordVideo: recordVideo,
      intervalId: intervalId
    });
  }

  startRecord() {
    this.setState({isRecording: true})
    setTimeout(() => {
      this.setState({ time: 2 });
    }, 3000)
    // start recording audio
    console.log('start audio recording');
    var recordAudio = RecordRTC(this.state.stream, {
      recorderType: StereoAudioRecorder,
      // mimeType: 'audio/wav'
      type: 'audio'
    });
    recordAudio.startRecording();

    // stores state
    this.setState({
      recordAudio: recordAudio,
    });
  }

  stopRecord(temp) {
    this.state.recordAudio.stopRecording(() => {
      console.log('Stop recording audio');

      uploadAudio(this.state.recordAudio.blob, this.state.userId, this.index - 1);
      // console.log(this.state.recordAudio.blob);
      // console.log(this.state.recordAudio);
      temp();
    });
    this.setState({isRecording: false});
  }





  startRecording() {
    this.nextQuestion();
  }

  timerEnd() {
    console.log('TIMER END');
  //   this.nextQuestion(); // force next question
  }


  callMerge() {
    mergeAndAnalyze(this.state.userId);
  }

  nextQuestion() {
    // setTimeout(() => {
    //   console.log('YOYOYO');
      this.setState({ time: null });
    // }, 3000)
    console.log('next question');
    console.log('start recording here', this.state);
    // if (!this.state.recordVideo) {
    //   this.startRecordVideo();
    // }
    // if (this.state.isRecording) {
    //   console.log('stop audio recording old and upload...');
    //   this.stopRecord(() => {
    //     this.startRecord();
    //   });
    //   // this.state.stream.getVideoTracks().forEach(function(track) {
    //   //   track.stop();
    //   // });
    //   // stop recording and restart...
    // } else {
    //   this.startRecord();
    // }

    this.setState({ doneTyping: false });
    this.index++;
    if (this.index === 1) {
      this.talk('Tell me about yourself');
    } else if (this.index === 2) {
      this.talk('Tell me about a project');
    } else if (this.index === 3) {
      this.talk('What is bubble sort?');
    } else {
      // END OF BEHAVIORAL SECTION
      // this.state.recordVideo.stopRecording(() => {
      //   console.log('Stop recording video');
      //   let params = {
      //     type: 'video/webm',
      //     data: this.state.recordVideo.blob,
      //     id: Math.floor(Math.random() * 90000) + 10000
      //   }
      //   clearInterval(this.state.intervalId);
      //   this.setState({ uploading: true, intervalId: null, time: '' });
      // });
      // this.state.stream.getVideoTracks().forEach(function(track) {
      //   track.stop();
      // });

      // now that behavioral is over, can merge audio
      // this.callMerge();
      alert('done');
      // this.props.history.push('/technical');
    }
  }

  onTypingEnd() {
    this.props.showBehavioralButton();
    if (this.props.session.status !== 'visited') {
      this.props.startTimer(2);
    }
  }

  buttonOnClick() {
    console.log(this.props.speak.action);
    if (this.props.session.next_status === 'behavioral') {
      this.props.getBehavioral();
    } else { // technical
      alert('done');
    }
  }

  render() {
    const { behavioral, speak, timer, session } = this.props;

    return(
      <div>
        {!this.props.session.status && <div>Loading...</div>}
        <Navbar {...this.props}/>
          {/*<video autoPlay muted src={this.state.src} style={{display: 'none'}}/>*/}
          <div style={{height: '60px', width: '100%'}}></div>
          <ParroBot />
        <div className="container" style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="columns">
            <div className="column is-vertical">
              {
                this.props.speak &&
                <TypeWriter onTypingEnd={this.onTypingEnd.bind(this)} fixed={true} style={{fontSize: '30px', textAlign: 'center'}} typing={1} initDelay={0}>
                  {this.props.speak.message}
                </TypeWriter>
              }
              {timer && <Timer time={timer} timerEnd={this.timerEnd.bind(this)} />}
          </div>
          </div>
          </div>
          {
            behavioral.showButton &&
            session.status === 'visited' &&
            session.next_status === 'behavioral' &&
            <button onClick={this.buttonOnClick.bind(this)} style={{position: 'absolute', top: '80%', left: '45.5%'}} className="button is-primary is-large">
              Let's Begin
            </button>
          }
          {
            behavioral.showButton &&
            session.status === 'behavioral' &&
            <button onClick={this.buttonOnClick.bind(this)} style={{position: 'absolute', top: '80%', left: '46.5%'}} className="button is-success is-large">
              <span className="icon">
                <i className="fa fa-arrow-right"></i>
              </span>
              <span>Next</span>
            </button>
          }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    sid: state.sid,
    speak: state.speak,
    behavioral: state.behavioral,
    timer: state.timer
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Behavioral);

import React from 'react';
import { captureUserMedia, takePhoto, uploadImage, uploadAudio } from './AppUtils';
import Webcam from './Webcam.react';
import RecordRTC from 'recordrtc';
const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;


const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);

class Recorder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recordVideo: null,
      src: null,
      intervalId: null,
      userId: null,
      modalOpen: this.props.modal,
      isRecording: false,
      clarity: null,
      speed: null,
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.setState({userId: '1234'})
    if(!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    this.requestUserMedia();
  }

  requestUserMedia() {
    captureUserMedia((stream) => {
      this.setState({ stream: stream, src: window.URL.createObjectURL(stream) });
    });
  }

  startRecord() {
    this.setState({isRecording: true})

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
    }, 2000)//333)

    // start recording audio
    console.log('start audio recording');
    var recordAudio = RecordRTC(this.state.stream, {
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav'
    });
    recordAudio.startRecording();

    // stores state
    this.setState({
      recordVideo: recordVideo,
      recordAudio: recordAudio,
      intervalId: intervalId
    });
  }

  stopRecord() {
    this.setState({isRecording: false});
    this.state.recordVideo.stopRecording(() => {
      console.log('Stop recording video');
      let params = {
        type: 'video/webm',
        data: this.state.recordVideo.blob,
        id: Math.floor(Math.random() * 90000) + 10000
      }
      clearInterval(this.state.intervalId);
      this.setState({ uploading: true, intervalId: null });
    });
    this.state.recordAudio.stopRecording(() => {
      console.log('Stop recording audio');
      uploadAudio(this.state.recordAudio.getBlob(), this.state.userId);
    });
  }

  closeModal() {
    this.state.stream.getVideoTracks().forEach(function(track) {
      track.stop();
    });
    this.props.modalClose();
  }

  render() {
    return(
      <div className={this.props.modal ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div><Webcam src={this.state.src}/></div>
          {this.state.isRecording ?
            <a onClick={this.stopRecord} className="button is-danger">
              <span className="icon">
                <i className="fa fa-stop-circle"></i>
              </span>
              <span>Stop Record</span>
            </a> :
            <a onClick={this.startRecord} className="button is-success">
              <span className="icon">
                <i className="fa fa-play-circle"></i>
              </span>
              <span>Start Record</span>
            </a>
          }
        </div>
        <button onClick={this.closeModal} className="modal-close is-large"></button>
      </div>
      // <div>
      //   <div className="columns">
      //     <div className="column is-one-third is-center">
      //     </div>
      //   </div>
      // </div>
    )
  }
}

export default Recorder;

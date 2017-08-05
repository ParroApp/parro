import axios from 'axios';

// handle user media capture
export function captureUserMedia(callback) {
  var params = { audio: true, video: true };

  navigator.getUserMedia(params, callback, (error) => {
    alert(JSON.stringify(error));
  });
};

export function takePhoto(video) {
  var canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || video.clientWidth;
  canvas.height = video.videoHeight || video.clientHeight;
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
};

export function uploadImage(photoEncoding, userId) {
  var blob = dataURItoBlob(photoEncoding);
  var formData = new FormData();
  formData.append('image', blob, `${new Date().toISOString()}-${userId}.png`);

  axios.post('/upload_image', formData)
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log('ERROR', err);
  });
};

export function uploadAudio(audioBlob, userId) {
  var formData = new FormData();
  console.log(audioBlob);
  formData.append('audio', audioBlob, `${new Date().toISOString()}-${userId}.wav`);

  axios.post('/upload_audio', formData)
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log('ERROR', err);
  });
};

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
  return new Blob([ab], { type: 'image/png' });
}

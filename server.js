const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const bodyParser = require('body-parser')
const audioAnalytics = require('./backend/audioAnalytics.js');
var Question = require('./backend/models/models').Question;
var _axios = require('axios');
var ffmpeg = require('fluent-ffmpeg');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './backend/uploads/pics')
  },
})

const upload = multer({ storage: storage })


const routes = require('./backend/routes/index');

var mongoose = require('mongoose');
const connect = 'mongodb://test:test@ds129013.mlab.com:29013/angelhack2017';
mongoose.connect(connect);

app.use(bodyParser.json());

app.post('/run_code', function(req, res) {
  var questionId = req.body.questionId;
  var code = req.body.code;
  var language = req.body.language;
  Question.findById(questionId)
  .then(foundQuestion => {
    var inputArr = foundQuestion.inputArr;
    var outputArr = foundQuestion.outputArr;
    var answerArr = [];
    var token = 'cd23c271-8018-420f-a556-f92402987134';
    var axios = _axios.create({
      headers: {
        Authorization: 'Token ' + token
      }
    })
    inputArr.forEach(function(input) {
      answerArr.push(axios.post('https://run.glot.io/languages/javascript/latest', {
        files: [
          {
            name: "main.js",
            content: code + ';\n console.log(solve("'+ input +'"))'
          },
        ]
      }).then(function(response) {
        return response.data;
      }).catch(function(err) {
        return err;
      }))
    });
    Promise.all(answerArr)
    .then(function(resolvedArr) {
      var status = {success: true, message: 'You got it right!'}
      resolvedArr.forEach(function(data, index) {
        var output = data.stdout.trim();
        if (output !== outputArr[index]) {
          status = {success: false, message: data.stderr || 'Your output did not match what we expected.'}
        }
      })
      res.json(status);
    })
  })
});

app.use('/', routes());

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/build', express.static(path.join(__dirname, 'build')));

app.post('/upload_image', upload.single('image'), function (req, res, next) {
  console.log(req.file);
  res.send({ success: true });
});

var count = 0;
app.post('/upload_audio', upload.single('audio'), function (req, res, next) {
  console.log(req.file);
  res.send();
  // audioAnalytics('./backend/uploads/pics/' + req.file.filename, (result) => {
  //   console.log('WATSON RESULT', result);
  // });
});

app.post('/merge', function(req, res, next) {

  // merge audio files -- don't necessarily need to be in order, right?
  // also be sure that these files are in .wav form
  ffmpeg()
  .input('./backend/uploads/pics/caea3efe05f366b6619fddc55e769f12.wav')
  .input('./backend/uploads/pics/0046f56e0132783a11479f1e7df32c8b.wav')
  .input('./backend/uploads/pics/b19ba40a5d59ac2e4c77bdc73085b90c.wav')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
    res.send({ success: false });
  })
  .on('end', function() {
    console.log('Merging finished !');
    res.send();
    audioAnalytics(`./backend/temp/merged_${req.body.userId}.wav`, (result) => {
      console.log('WATSON RESULTS MERGED', result);
    });
  })
  .mergeToFile(`./backend/temp/merged_${req.body.userId}.wav`);

})

app.get('/*', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});

'use strict';

import express from 'express';
import axios from 'axios';
import multer from 'multer';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import audioAnalytics from '../audioAnalytics';
import { Company, Question } from '../models/models';

const router = express.Router();
const upload = multer();
const s3 = new aws.S3();

router.post('/upload', upload.single('content'), (req, res) => {
  if (!req.body.sessionId) {
    return res.status(403).json({ error: 'Invalid session id.' });
  }

  if (!req.file) {
    return res.status(403).json({ error: 'Invalid file.' });
  }

  if (!req.file.originalname) {
    return res.status(403).json({ error: 'Invalid file name.' });
  }

  if (!['image/png', 'audio/wav'].includes(req.file.mimetype)) {
    return res.status(403).json({ error: 'Invalid file type.' });
  }

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.file.originalname,
    ContentType: req.file.mimetype,
    Body: req.file.buffer,
  };

  s3.putObject(s3Params).promise()
  .then(data => {
    res.end();
  })
  .catch(err => {
    console.log(err);
    res.status(403).json({ error: 'Not authorized.' });
  });
});


var count =0;
router.post('/upload_audio', upload.single('audio'), function (req, res, next) {
  console.log('AUDIO');
  console.log(req.file);
  res.send();
  audioAnalytics('./backend/uploads/pics/' + req.file.filename, (result) => {
    // res.json(result);
    console.log(result);
  });
});

router.post('/send/demo/email', function(req, res) {
  var { name, email } = req.body;

  new Interview({
    name, email
  }).save()
  .then(interview => {
    res.json(interview);
  })
  .catch(err => {
    res.json(interview);
  })

});

router.post('/createQuestion', function(req, res) {
  var inputArr = req.body.inputArr;
  var outputArr = req.body.outputArr;
  var question = req.body.question;

  new Question({
    inputArr,
    outputArr,
    question
  }).save()
  .then(question => {
    res.json(question);
  })
});

router.post('/run_code', function(req, res) {
  var questionId = req.body.questionId;
  var code = req.body.code;
  console.log('code', code);
  var language = req.body.language;
  Question.findById(questionId)
  .then(foundQuestion => {
    console.log('foundQuestion', foundQuestion);
    var inputArr = foundQuestion.inputArr;
    var outputArr = foundQuestion.outputArr;
    var answerArr = [];
    var token = 'cd23c271-8018-420f-a556-f92402987134';
    var axios = _axios.create({
      headers: {
        Authorization: 'Token ' + token
      }
    })
    console.log('INPUTARRONE', inputArr);
    inputArr.forEach(function(input) {
      console.log('INPUT', input);
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
    console.log('INPUT ARR', inputArr);
    Promise.all(answerArr)
    .then(function(resolvedArr) {
      console.log('RESOLVED ARR', resolvedArr);
      var status = {success: true, message: 'You got it right!'}
      resolvedArr.forEach(function(data, index) {
        var output = data.stdout.trim();
        console.log(output);
        console.log(outputArr);
        if (output !== outputArr[index]) {
          status = {success: false, message: data.stderr || 'Your output did not match what we expected.'}
        }
      })
      res.json(status);
    })
  })
});

router.get('/companies', function(req, res) {
  Company.find()
  .then(companies => {
    res.json(companies);
  })
});

router.get('/questions', function(req, res) {
  Question.find()
  .then(questions => {
    res.json(questions);
  })
});

router.post('/createCompany', function(req, res) {
  var { name, behavQ1, behavQ2, behavQ3, behavQ4, companyCulture, responsibilities,
    futureOfCompany, typicalDay, bestThingAboutCompany,
    lookingForInRole, techQ1, techQ2 } = req.body;

  new Company({
    name, behavQ1, behavQ2, behavQ3, behavQ4, companyCulture,
    responsibilities, futureOfCompany, typicalDay,
    bestThingAboutCompany, lookingForInRole, techQ1,
    techQ2
  }).save()
  .then(company => {
    res.json(company);
  })
  .catch(err => {
    res.json(err);
  })

});

router.post('/createQuestion', function(req, res) {
  var inputArr = req.body.inputArr;
  var outputArr = req.body.outputArr;
  var question = req.body.question;

  new Question({
    inputArr,
    outputArr,
    question
  }).save()
  .then(question => {
    res.json(question);
  })

});

//Web hooks for api.ai
router.post('/q', function(req, res) {
  var lang = req.body.result.parameters.proglang;
  var task = req.body.result.parameters.progtask;
  var question = req.body.result.parameters.company;

  if(question) {
    if(question == 'culture') {
      return;
    }
  }

  if(lang && lang == 'Javascript') {
    if(task && task == 'print statement') {
      var response = 'You can do console.log()'
      res.send(JSON.stringify({ "speech": response, "displayText": response}));
    }
  } else if(lang && lang == 'C++') {
    if(task && task == 'print statement') {
      var response = 'cout << "text" << endl'
      res.send(JSON.stringify({ "speech": response, "displayText": response}));
    } else if(task && task == 'input') {
      var response = 'cin >> "text"'
      res.send(JSON.stringify({ "speech": response, "displayText": response}));
    } else if(task && task == 'output') {
      var response = 'cout << "text" << endl'
      res.send(JSON.stringify({ "speech": response, "displayText": response}));
    }
  }
});

router.post('/apiai', upload.single('audio'), function (req, res, next) {
  console.log('AUDIO');
  console.log(req.file);

  const apiai = require("api.ai");

  const nlp = new apiai({
    token: "TOKEN",
    session: new Date().toISOString() // rip
  });

  nlp.voice('./backend/uploads/pics/' + req.file.filename,
    { sessionId: new Date().toISOString(), language: 'en' },
   function(x) {
    res.json(x);
  });
});

// router.post('/companyq', function(req, res) {
//   var task = req.body.result.parameters.TODOOOOO;
//   console.log(task);
// });

router.get('/sendEmail', function(req, res) {
  sendEmail();
  res.send('done');
})

var sendEmail = function(somedata){
  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL,
                  // you can try with TLS, but port is then 587
    auth: {
      user: 'EMAIL',
      pass: 'PASS'
    }
  };

  var transporter = nodemailer.createTransport(smtpConfig);
  // replace hardcoded options with data passed (somedata)
  var mailOptions = {
    from: 'FROM', // sender address
    to: 'DEST', // list of receivers
    subject: "NAME Application", // Subject line
    text: 'NAME completed her application! Visit http://localhost:3000/1337/home to see her results.'
  }

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return false;
    }else{
      console.log('Message sent: ' + info.response);
      return true;
    };
  });
}

router.get('/3485983fskj342j/home', function(req, res) {
  sendEmail('hi');
  res.send('done');
})

module.exports = router;

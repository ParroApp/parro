'use strict';

import express from 'express';
import axios from 'axios';
import multer from 'multer';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';
import audioAnalytics from '../audioAnalytics';
import { Company, Question, Interview } from '../models/models';
var ffmpeg = require('fluent-ffmpeg');
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

router.post('/merge', function(req, res, next) {

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
    var _axios = axios.create({
      headers: {
        Authorization: 'Token ' + token
      }
    })
    console.log('INPUTARRONE', inputArr);
    inputArr.forEach(function(input) {
      console.log('INPUT', input);
      answerArr.push(_axios.post('https://run.glot.io/languages/javascript/latest', {
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

import validator from 'email-validator';

// TEMPORARY ROUTES
// retrieves the current state
router.get('/api/status', (req, res) => {
  req.checkQuery('sid', 'Invalid sid.').notEmpty().isAlphanumeric();

  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      console.log(result.array());
      throw new Error;
    }
    return Interview.findOne({ sessionId: req.query.sid })
  })
  .then(session => {
    if (!session) {
      console.log('Empty session');
      throw new Error;
    }
    if (session.status === 'received') {
      session.status = 'visited';
      return session.save();
    }
    return session;
  })
  .then(session => {
    res.json({
      name: session.name,
      status: session.status,
      next_status: 'behavioral'
    })
    console.log(session);
  })
  .catch(err => {
    res.status(403).json({ error: 'Internal server error.' });
  })
});

router.get('/api/behavioral', (req, res) => {
  req.checkQuery('sid', 'Invalid sid.').notEmpty().isAlphanumeric();

  req.getValidationResult()
  .then(function(result) {
    if (!result.isEmpty()) {
      console.log(result.array());
      throw new Error;
    }
    return Interview.findOne({ sessionId: req.query.sid })
  })
  .then(session => {
    if (!session) {// || session.next_status !== 'behavioral') {
      console.log('Empty session');
      throw new Error;
    }
    if (session.status === 'visited') {
      session.status = 'behavioral';
      return session.save();
    }
    // only update next status when audio is submitted
    return session;
  })
  .then(session => {
    res.json({
      session: {
        name: session.name,
        status: session.status,
        next_status: 'behavioral'
      },
      behavioral: {
        message: 'Tell me about yourself'
      }
    })
    console.log(session);
  })
  .catch(err => {
    res.status(403).json({ error: 'Internal server error.' });
  })
});
// 2a29f7afeeab715260ef393c48147765d9f7521b817dac18cac23455c5f9a089e98b8850b464c79a61a9c9ea5fe9eaa0c80833b1d2f3f7ef365bb09b48a5f081

router.use('/api', (req, res) => {
  res.status(403).json({ error: 'Invalid params.' });
});

router.get('/trigger_email', (req, res) => {
  if (!req.query.name || !req.query.email) {
    res.status(403).json({ error: 'Missing fields.' });
    return;
  }

  const name = req.query.name;
  const email = req.query.email;
  if (name.trim().length < 3) {
    res.status(403).json({ error: 'Invalid name format.' });
    return;
  }
  if (!validator.validate(email)) {
    res.status(403).json({ error: 'Invalid email format.' });
    return;
  }

  const interview = new Interview({ name, email });
  interview.save()
  .then(function(saved) {
    console.log(saved);
    // TODO: send email
    res.json(saved);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).json({ error: 'Error.' });
  });
});

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

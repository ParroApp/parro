var express = require('express');
var router = express.Router();
var models = require('../models/models');
var Company = models.Company;
var Question = models.Question;

module.exports = function() {

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
  const nodemailer = require('nodemailer');

  const multer = require('multer');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './backend/uploads/pics')
    }
  })

  const upload = multer({ storage: storage })


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

  return router;
};

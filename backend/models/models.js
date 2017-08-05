var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  behavQ1: {
    type: String,
    required: true
  },
  behavQ2: {
    type: String,
    required: true
  },
  behavQ3: {
    type: String,
    required: true
  },
  behavQ4: {
    type: String,
    required: true
  },
  techQ1: {
    type: Schema.ObjectId,
    ref: 'Question'
  },
  techQ2: {
    type: Schema.ObjectId,
    ref: 'Question'
  },
  companyCulture: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  futureOfCompany: {
    type: String,
    required: true
  },
  typicalDay: {
    type: String,
    required: true
  },
  bestThingAboutCompany: {
    type: String,
    required: true
  },
  lookingForInRole: {
    type: String,
    required: true
  }
})

var QuestionSchema = new Schema ({
  question: {
    type: String,
    required: true
  },
  inputArr: {
    type: Array,
    required: true
  },
  outputArr: {
    type: Array,
    required: true
  }
});

var UserSchema = new Schema({
  data: {
    type: Object,
    require: true
  },
})


var Company = mongoose.model('Company', CompanySchema)
var Question = mongoose.model('Question', QuestionSchema)
var User = mongoose.model('User', UserSchema)

module.exports = {
  Company: Company,
  Question: Question,
  User: User
};

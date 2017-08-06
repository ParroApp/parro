'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';

const Company = mongoose.model('Company', {
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
    type: mongoose.Schema.ObjectId,
    ref: 'Question'
  },
  techQ2: {
    type: mongoose.Schema.ObjectId,
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

const Question = mongoose.model('Question', {
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
})

const User = mongoose.model('User', {
  data: {
    type: Object,
    require: true
  }
})

const Interview = mongoose.model('Interview', {
  sessionId: {
    type: String,
    required: true,
    default: crypto.randomBytes(64).toString('hex')
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: [
      'received', // Link sent out to candidate
      'visited', // Candidate visited link
      'behavioral', // Candidate started on behavioral
      'technical', // Candidate started on technical
      'completed' // Candidate completed interview
    ],
    required: true,
    default: 'received'
  },
  state: String,
  startTime: Date,
  behavioral: String,
  technical: String
});

module.exports = { Company, Question, User, Interview };

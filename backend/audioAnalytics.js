var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

var speech_to_text = new SpeechToTextV1({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
});

module.exports = function(file, cb) {

  var params = {
    // From file
    audio: fs.createReadStream(file),
    content_type: 'audio/wav',
    word_confidence: true,
    timestamps: true,
    keywords: ['Like', 'You Know', 'Actually', 'I Mean', 'Sort of', 'Kind Of', 'Right', 'Uh', 'Um', 'Uhm'],
    keywords_threshold: 0.5,
    profanity_filter: true
  };

  speech_to_text.recognize(params, function(err, res) {
    if (err)
      console.log(err);
    else
      var analytics = {
        pauses: calculatePauses(res),
        wordFrequency: wordCount(res),
        speed: speakerSpeed(res),
        clarity: calculateClarity(res),
        duration: calculateDuration(res),
        cursingCount: cursingCount(res)
      }
      cb(analytics);
  });

  function calculatePauses(res) {
    var pauses = [];
    var prevEnd = false;
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.timestamps.forEach((wordStats, index) => {
          if (wordStats[0] === '%HESITATION') {
            pauses.push(wordStats[2] - wordStats[1]);
          }
          if (index === alternative.timestamps.length - 1) {
            prevEnd = wordStats[2];
          }
          if (index === 0 && prevEnd) {
            pauses.push(wordStats[1] - prevEnd);
          }
        })
      })
    })
    return {data: pauses, preview: pauses.length};
  }

  function wordCount(res) {
    var _ = require('underscore');
    var wordCount = {};
    var numberOfWords = 0;
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.timestamps.forEach(wordStats => {
          if (wordStats[0] !== '%HESITATION') {
            numberOfWords += 1;
            if(wordCount.hasOwnProperty(wordStats[0])) {
              wordCount[wordStats[0]] = wordCount[wordStats[0]] + 1;
            } else {
              wordCount[wordStats[0]] = 1;
            }
          }
        })
      })
    })
    wordCount = _.chain(wordCount).pairs().sort((a, b) => {
      return b[1] - a[1];
    }).value();
    console.log('wordCount', wordCount);
    return {data: wordCount, preview: numberOfWords};
  }

  function speakerSpeed(res) {
    var allWordObjs = [];
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.timestamps.forEach(wordStats => {
          if (wordStats[0] !== '%HESITATION') {
            allWordObjs.push(wordStats);
          }
        })
      })
    })
    var wordFreq = [];
    var totalWordFreq = 0;
    var wordCount = Math.max(allWordObjs.length, 1);
    allWordObjs.forEach((wordObj, index) => {
      if (index < allWordObjs.length - 5) {
        var timeSpan = allWordObjs[index + 4][2] - wordObj[1];
        var wordsPerMinute = 5 / timeSpan * 60;
        wordFreq.push(wordsPerMinute);
        totalWordFreq += wordsPerMinute;
      }
    })
    var preview = totalWordFreq / wordCount;
    return {data: wordFreq, preview};
  }

  function calculateClarity(res) {
    var clarityArray = [];
    var totalClarity = 0;
    var wordCount = 0;
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.word_confidence.forEach(wordStats => {
          clarityArray.push(wordStats[1]);
          totalClarity += wordStats[1];
          wordCount += 1;
        })
      })
    })
    var clarityAvg = totalClarity / Math.max(wordCount, 1) * 100
    return {data: clarityArray, preview: clarityAvg};
  }

  function calculateDuration(res) {
    var allWordObjs = [];
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.timestamps.forEach(wordStats => {
          if (wordStats[0] !== '%HESITATION') {
            allWordObjs.push(wordStats);
          }
        })
      })
    })
    if (allWordObjs.length < 2) {
      return 0;
    }
    return allWordObjs[allWordObjs.length - 1][2] - allWordObjs[0][1];
  }

  function cursingCount(res) {
    var badWords = require('bad-words');
    var cursingCount = 0;
    var customFilter = new badWords({ placeHolder: '*'});
    res.results.forEach(section => {
      section.alternatives.forEach(alternative => {
        alternative.timestamps.forEach(wordStats => {
          if (customFilter.clean(wordStats[0]).indexOf('*') !== -1) {
            cursingCount += 1;
          }
        })
      })
    })
    return cursingCount;
  }
}

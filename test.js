var ffmpeg = require('fluent-ffmpeg');

// Note: requires ffmpeg to have been installed on your system
ffmpeg()
  .input('./backend/uploads/pics/caea3efe05f366b6619fddc55e769f12.wav')
  .input('./backend/uploads/pics/0046f56e0132783a11479f1e7df32c8b.wav')
  .input('./backend/uploads/pics/b19ba40a5d59ac2e4c77bdc73085b90c.wav')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Merging finished !');
  })
  .mergeToFile('./temp/merged.wav');

// deleting files subsequently?
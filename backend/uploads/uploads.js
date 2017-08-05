var chokidar = require('chokidar');
var jsonfile = require('jsonfile');
var _ = require('lodash');
var cmd = require('node-cmd');
var base64Img = require('base64-img');
var axios = require('axios');


const maxThresh = Math.floor(.1 * 69)
const secThresh = Math.floor(.3 * 69)
var count = 0;
var lastImgPath = null;

console.log('hi');

// Initialize watcher.
var watcher = chokidar.watch('pics/', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});


watcher.on('add', file => processFile(file));

function processFile(file) {
  if(file.includes('.json')) {
    processJSON(file);
  } else {
    // cmd.run('.\windows\x64\Release\OpenPoseDemo.exe --face --render_pose 0 --face_render 1 --image_dir pics --write_keypoint_json json');
    // console.log('lii')
    if(lastImgPath) {
      console.log('yo')

      url1='';
      url2=''

      axios({
        method: 'post',
        url: 'https://api-us.faceplusplus.com/facepp/v3/compare',
        params: {
          api_key: 'KEY',
          api_secret: 'SECRET',
          image_base64_1: url1,
          image_base64_2: url2
        }
      })
      .then(function(response) {
        //console.log(response)
        lastImgPath = file;
      })
      .catch(function(e) {
        console.log(e)
      })
    } else {
      lastImgPath = file;
    }
  }
}

function processJSON(file) {
  jsonfile.readFile(file, function(err, obj) {
    var faces = [];

    _.forEach(obj.people, function(o) {
      var face = {x: [], y: [], c: []};

      for(var i=0;i<o.face_keypoints.length;i++) {
        if(i % 3 == 0) {
          face.x.push(o.face_keypoints[i]);
        } else if(i % 3 == 1) {
          face.y.push(o.face_keypoints[i]);
        } else {
          face.c.push(o.face_keypoints[i]);
        }
      }
      faces.push(face);
    });

    faces = _.orderBy(faces, [ function(o) {return _.mean(o.c)} ], ['desc']);
    rekt(faces[0]);
  });
}

function rekt(face) {
  if(_.filter(face.c, function(num) {return num < .3}).length > maxThresh) {
    console.log('not facing')
    return;
  }

  if(Math.abs(face.y[37] - face.y[41]) < 15) {
    console.log('eye low')
  } else if(Math.abs(face.y[37] - face.y[41]) > 25) {
    console.log('eye high')
  }

  if(Math.abs(face.y[48] - face.y[58]) < 25) {
    console.log('smiling')
  }
}

var path = require('path')
var express = require('express');
var bodyParser = require('body-parser');

var ffmpeg = require('fluent-ffmpeg');
// make sure you set the correct path to your video file
var Adapter = require("./Adapter");
var db = new Adapter()


var app = express();
app.set('port', process.env.PORT || 9000);
app.use(bodyParser.json());

app.post('/upload', function(req, res, next) {
  console.log(req.body)
  
  var a = Date.now() + '-b2b.mp4'
  var videoPath = 'uploads/'+a
  var s3_video_url = 'https://s3.amazonaws.com/b2b-media/'+a 
  // console.log(videoPath)
  // console.log(req.body)

  var proc = ffmpeg()
    .addOutputOption('-loop', 1)
    .addOutputOption('-r 1')
    .addOutputOption('-i', req.body.image)
    .addOutputOption('-i', req.body.audio)
    .addOutputOption('-c:a copy')
    .addOutputOption('-c:v libx264')
    .addOutputOption('-crf 25')
    // .addOption('-vf drawtext="fontfile=font.ttf: text=\'Stack Overflow\': fontcolor=white: fontsize=30"')
    .addOutputOption('-shortest')
    .save(videoPath)
    .on('start', function(ffmpegCommand) {
      /// log something maybe
      console.log(ffmpegCommand)
      res.end()

    })
    .on('progress', function(data) {
      console.log(data)

      /// do stuff with progress data if you want
    })
    .on('end', function() {

      console.log('file has been converted succesfully');
      db.InsertVideoUrl(req.body.post_id, s3_video_url)
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })


  // res.end();
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var syncrequest = require('sync-request');
var bodyParser = require('body-parser');
var async = require('async');
var moment = require('moment');
var app = express();
var zoom_api_key = "YOUR_API_KEY";
var zoom_api_sec = "YOUR_API_SECRET";
var useremail = "YOUR_ZOOM_EMAIL";
var roomurl = "https://addon.zoom.us/webhook/incoming/ca27a15ddb3f4c72abc7f229b0b6fa8b";

console.log("Starting node ...");



app.get('/', function(req, res) {
var zoomurl = "https://api.zoom.us/v1/user/getbyemail/";
  var option = {
    qs: {api_key: zoom_api_key, api_secret: zoom_api_sec, data_type: "JSON", email: useremail, login_type: "100"}
  };
  var syncres = syncrequest('POST', zoomurl, option);
  var response=JSON.parse(syncres.getBody('utf8'));
  var zoom_user_id = response.id;
  var zoomurl = "https://api.zoom.us/v1/meeting/list/";
  var option = {
    qs: {api_key: zoom_api_key, api_secret: zoom_api_sec, data_type: "JSON", host_id: zoom_user_id }
  };
  var syncres = syncrequest('POST', zoomurl, option);
  var response=JSON.parse(syncres.getBody('utf8'));
  var meeting_array = response.meetings;
  
  //meetings is an arrary - iterate through that and find the ones that are not started
  meeting_array.forEach(function(value) {
    // check if the meeting has not been started (status = 0) and the start time is now
    if (value.status == 0) {
      
      // check the start time and see if it matches the current time
      var now = moment();
      start_time = value.start_time;
      isotime = now.toISOString();
      var minutesPassed = moment(isotime).diff(start_time,"minutes");
      if(start_time==isotime || (minutesPassed<10 && minutesPassed>=0)){

        var requestData = {
          "async": true,
          "crossDomain": true,
          "url": "https://addon.zoom.us/webhook/incoming/2f8df9bcc4434b8dadd93abfcf291059",
          "method": "POST",
          "headers": {
          "x-zoom-token": "6jyZ5jE3gDs2q7hR",
          "content-type": "application/json",
          "cache-control": "no-cache",
          "postman-token": "30f5ce1f-01de-b3aa-3c41-9d5c7d1238ce"
          },
        "processData": false,
        "title": "",
        "summary": "<p><a href=\"https://zoom.us/meeting\">Scheduled Meeting not Started!</a></p>",
        "body": ""

        }
      request({
        url: "https://addon.zoom.us/webhook/incoming/2f8df9bcc4434b8dadd93abfcf291059",
        method: "POST",
        json: true,
        headers: {
          "content-type": "application/json",
          "x-zoom-token": "6jyZ5jE3gDs2q7hR",
          "content-type": "application/json"
        },
      body: requestData
      }, function(err, res, body) {
 
        });
    }
  }
});



});
var now = moment();
isotime = now.toISOString();
console.log(isotime);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(8081);

console.log("Node has started");

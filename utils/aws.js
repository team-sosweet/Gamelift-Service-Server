let AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-2'});

let gamelift = new AWS.GameLift();

module.exports = gamelift;
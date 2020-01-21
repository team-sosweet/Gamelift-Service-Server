const express = require('express');
const schedule = require('node-schedule');

const cache = require('../utils/redisClient');

let router = express.Router();

router.post('/id', async function(req, res, next) {
    let fleetId = req.body.fleetId;
    cache.set('fleetId', fleetId, function(err, data) {
        res.json(data);
    });
})

router.get('/', async function(req, res, next) {
    cache.get('fleetId', function(err, data) {
        res.json(data);
    })
})

let scheduler = schedule.scheduleJob({hour: 23, minute: 48}, function() {
    console.log('hello');
})

// function updateFleetCapacity() {
    
// }

module.exports = router;
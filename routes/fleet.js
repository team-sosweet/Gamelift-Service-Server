const express = require('express');
const schedule = require('node-schedule');

let gamelift = require('../utils/aws');
const cache = require('../utils/redisClient');

let router = express.Router();

router.post('/id', function(req, res, next) {
    let fleetId = req.body.fleetId;
    cache.set('fleetId', fleetId, function(err, data) {
        res.status(201).json({description: data});
    });
})

router.get('/', async function(req, res, next) {
    cache.get('fleetId', function(err, data) {
        res.json({description: data});
    })
})

let startGame = schedule.scheduleJob({hour: 17, minute: 25}, async function() {
    await updateFleetCapacity(1);
})

let endGame = schedule.scheduleJob({hour: 18, minute: 40}, async function() {
    await updateFleetCapacity(0);
})


async function updateFleetCapacity(size) {
    let fleetId = await getFleetId();
    let updateParams = {
        FleetId: fleetId,
        DesiredInstances: size
    }

    return new Promise(function(resolve, reject) {
        gamelift.updateFleetCapacity(updateParams, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

function getFleetId() {
    return new Promise(function(resolve, reject) {
        cache.get('fleetId', function(err, data) {
            if(err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = router;
const express = require('express');
const Err = require('../utils/Err');

let router = express();

let latencies = {};

router.get('/start', function(req, res, next) {
    let id = req.query.id;
    let time = new Date();
    latencies[id] = time;
    res.status(200).json(latencies);
})

router.get('/end', function(req, res, next) {
    let id = req.query.id;
    let time = new Date();
    let result = time - latencies[id];
    res.status(200).json({latency: result});
})

module.exports = router;
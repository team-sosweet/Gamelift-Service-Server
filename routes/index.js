const express = require('express');

let matchRouter = require('./match');
let latencyRouter = require('./latency');

let router = express.Router();

router.use('/match', matchRouter);
router.use('/latency', latencyRouter);

module.exports = router;
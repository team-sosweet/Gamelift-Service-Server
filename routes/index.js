const express = require('express');

let matchRouter = require('./match');

let router = express.Router();

router.use('/match', matchRouter);

module.exports = router;
'use strict'

const express = require('express');
const matchDayController = require('../controllers/match-day.controller');
const md_authentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/createMatchDay/:LeagueId', md_authentication.ensureAuth, matchDayController.createMatchDay);

module.exports = api;
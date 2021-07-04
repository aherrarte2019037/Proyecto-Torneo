'use strict'

const express = require('express');
const matchDayController = require('../controllers/match-day.controller');
const md_authentication = require('../middlewares/authenticated');

var api = express.Router();

api.post('/createMatchDay/:LeagueId', md_authentication.ensureAuth, matchDayController.createMatchDay);
api.put('/changeDate/:idMatchDay', md_authentication.ensureAuth, matchDayController.changeDate)
api.get('/assignTeams/:idMatchDay', md_authentication.ensureAuth, matchDayController.assignTeams)

module.exports = api;
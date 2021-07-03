'use strict'

const express = require('express')
const leagueController = require('../controllers/league.controller')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/createLeague', md_authentication.ensureAuth, leagueController.createLeague)
api.put('/editLeague/:idLeague', md_authentication.ensureAuth, leagueController.editLeague)
api.delete('/deleteLeague/:idLeague', md_authentication.ensureAuth, leagueController.deleteLeague)
api.get('/getLeagueID/:idLeague', md_authentication.ensureAuth, leagueController.getLeagueID)
api.get('/getLeaguesIdCreator', md_authentication.ensureAuth, leagueController.getLeaguesIdCreator)
api.put('/addTeam/:idLeague', md_authentication.ensureAuth, leagueController.addTeam)

module.exports = api
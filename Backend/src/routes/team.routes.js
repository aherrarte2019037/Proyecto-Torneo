'use strict'

const express = require('express')
const teamController = require('../controllers/team.controller')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/createTeam', md_authentication.ensureAuth, teamController.createTeam)
api.put('/editTeam/:idTeam', md_authentication.ensureAuth, teamController.editTeam)
api.delete('/deleteTeam/:idTeam', md_authentication.ensureAuth, teamController.deleteTeam)
api.get('/getTeam/:idTeam', md_authentication.ensureAuth, teamController.getTeamID)
api.put('/addPlayer/:idTeam', md_authentication.ensureAuth, teamController.addPlayer)

module.exports = api
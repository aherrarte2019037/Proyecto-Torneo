'use strict';

const express = require("express")
const userController = require('../controllers/user.controller')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/login', userController.login)
api.post('/registerUser', userController.registerUser)
api.put('/editUser/:idUser', md_authentication.ensureAuth, userController.editUser)
api.get('/getUserID/:idUser', md_authentication.ensureAuth, userController.getUserID)
api.delete('/deleteUser/:idUser', md_authentication.ensureAuth, userController.deleteUser)

module.exports = api
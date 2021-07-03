'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var TeamSchema = Schema({
    name: String,
    players: [{
        name: String,
        lastname: String,
        number: String
    }],
    coach: String,
    emblem: String,
    idLeague: String
})

module.exports = mongoose.model('Teams', TeamSchema)
'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var LeagueSchema = Schema({
    name: String,
    emblem: String,
    teams:[{
        type: Schema.Types.ObjectId, ref: 'Teams'
    }],
    idCreator: { type: Schema.Types.ObjectId, ref: 'Users' }
})

module.exports = mongoose.model('Leagues', LeagueSchema)
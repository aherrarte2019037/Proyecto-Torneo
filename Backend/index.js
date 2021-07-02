'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;

const USER = 'root';
const PASS = 'root';
const PORT = 27017;
const DB = 'TorneDeportivo';
const haveCredentials = true;
let URL = '';

if( haveCredentials ) {
    URL = `mongodb://${USER}:${PASS}@localhost:${PORT}/${DB}?authSource=admin`;

} else {
    URL = 'mongodb://localhost:27017/TorneoDeportivo';
}

mongoose.connect( URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Successful database connection')

    app.listen(3000, function () {
        console.log('Server running on port 3000')
    })
}).catch(err => console.log(err))
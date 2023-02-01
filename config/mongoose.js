const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongo db'));

db.once('open', function(){
    console.log('Connected to mongo-db');
})

module.exports = db;
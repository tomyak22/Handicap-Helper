const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
// import routers
const roundsRoutes = require('./routes/rounds');

mongoose.connect('mongodb://localhost/HandicapHelperDB')
    .then(() => {
        console.log('Connected');
    })
    .catch(() => {
        console.log('Error Connecting');
    });

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Request, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use('/api/rounds', roundsRoutes);
module.exports = app;
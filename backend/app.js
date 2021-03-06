const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
// import routers
const roundsRoutes = require('./routes/rounds');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb://mongo:27017/HandicapHelperDB')
    .then(() => {
        console.log('Connected');
    })
    .catch(() => {
        console.log('Error Connecting');
    });

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, 'dist/handicap-helper')));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Request, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

app.use('/api/rounds', roundsRoutes);
app.use('/api/user', userRoutes);
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "dist/handicap-helper", "index.html"));
});
module.exports = app;
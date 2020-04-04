const express = require('express');
const bodyParser = require('body-parser');
//import model
const Round = require('./models/round');
const mongoose = require('mongoose');

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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/rounds', (req, res, next) => {
    const round = new Round({
        score: req.body.score,
        course: req.body.course,
        rating: req.body.rating,
        slope: req.body.slope,
        date: req.body.date
    });
    round.save().then(result => {
        res.status(201).json({
            message: 'Sent!',
            roundId: result._id
        });
    });
});

app.get('/api/rounds', (req, res, next) => {
    Round.find()
        .then(documents => {
            res.status(200).json({
                message: 'Rounds fetched correctly',
                rounds: documents
            });
        });
});

app.delete("/api/rounds/:id", (req, res, next) => {
    Round.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "Post Deleted!"});
    }); 
});

module.exports = app;
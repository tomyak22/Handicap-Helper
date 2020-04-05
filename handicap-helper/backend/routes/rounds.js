const express = require('express');
const router = express.Router();
const Round = require('../models/round');

router.post('', (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
    const round = new Round({
        _id: req.body.id,
        score: req.body.score,
        course: req.body.course,
        rating: req.body.rating,
        slope: req.body.slope,
        date: req.body.date
    });
    Round.updateOne({_id: req.params.id}, round).then(result => {
        res.status(200).json({message: "Update Successful!"});
    });
})

router.get('', (req, res, next) => {
    Round.find()
        .then(documents => {
            res.status(200).json({
                message: 'Rounds fetched correctly',
                rounds: documents
            });
        });
});

router.get('/:id', (req, res, next) => {
    Round.findById(req.params.id).then(round => {
        if (round) {
            res.status(200).json(round);
        } else {
            res.status(404);
        }
    })
});

router.delete("/:id", (req, res, next) => {
    Round.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "Post Deleted!"});
    }); 
});

module.exports = router;
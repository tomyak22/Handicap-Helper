const express = require('express');
const multer = require('multer');
const router = express.Router();
const Round = require('../models/round');

// Middleware for Auth
const checkAuth = require('../middleware/check-auth');

// mime map for accepted images
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// where to store images using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    // create file name to be stored in 'images'
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

/**
 * POST new round to the database with score, course, rating, slope, and date played.
 */
router.post('', checkAuth, (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const round = new Round({
        score: req.body.score,
        course: req.body.course,
        rating: req.body.rating,
        slope: req.body.slope,
        date: req.body.date,
        creator: req.userData.userId
    });
    round.save().then(result => {
        res.status(201).json({
            message: 'Sent!',
            roundId: result._id
        });
    });
});

/**
 * PUT method to update and existing round by id. 
 */
router.put("/:id", checkAuth, (req, res, next) => {
    const round = new Round({
        _id: req.body.id,
        score: req.body.score,
        course: req.body.course,
        rating: req.body.rating,
        slope: req.body.slope,
        date: req.body.date
    });
    Round.updateOne({ _id: req.params.id }, round).then(result => {
        res.status(200).json({ message: "Update Successful!" });
    });
})

/**
 * GET method in order to return rounds.
 * If there is a pageSize and currentPage param, use the params to construct
 * what is to be used on the front end. Round count is for the front end so
 * we stop our paginator at the maxRounds in the database.
 */
router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const roundQuery = Round.find();
    let fetchedRounds;

    if (pageSize && currentPage) {
        roundQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    roundQuery
        .then(documents => {
            fetchedRounds = documents;
            return Round.count();
        }).then(count => {
            res.status(200).json({
                message: "Rounds retrieved",
                rounds: fetchedRounds,
                maxRounds: count
            });
        });
});

/**
 * GET method that returns the last 20 rounds sorted
 * by the date played
 */
router.get('/lastTwentyRounds', (req, res, next) => {
    let fetchedRounds
    Round.find({}).sort({date: 'descending'}).limit(20).exec(function(err, documents) { 
        //TODO: throw error
        res.status(200).json({
            message: "Last 20 rounds retrieved",
            rounds: documents
        });
    });
});

/**
 * GET method that returns a round by id.
 * @param id for round id
 */
router.get('/:id', (req, res, next) => {
    Round.findById(req.params.id).then(round => {
        if (round) {
            res.status(200).json(round);
        } else {
            res.status(404);
        }
    })
});

/**
 * DELETE method that deletes a round by id.
 * @param id for round id
 */
router.delete("/:id", checkAuth, (req, res, next) => {
    Round.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: "Post Deleted!" });
    });
});

module.exports = router;
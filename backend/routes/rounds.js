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
        date: req.body.date,
        creator: req.userData.userId
    });
    Round.updateOne({ _id: req.params.id, creator: req.userData.userId }, round).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({ message: "Update Successful!" });
        } else {
            res.status(401).json({ message: "User Not Authorized!" });
        }
    });
})

/**
 * GET method in order to return rounds.
 * If there is a pageSize and currentPage param, use the params to construct
 * what is to be used on the front end. Round count is for the front end so
 * we stop our paginator at the nRounds in the database.
 */
router.get('', checkAuth, (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const roundQuery = Round.find({creator: req.userData.userId}).sort({date: 'descending'});
    let fetchedRounds;

    if (pageSize && currentPage) {
        roundQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    roundQuery
        .then(documents => {
            fetchedRounds = documents;
            return Round.count({creator: req.userData.userId});
        }).then(count => {
            res.status(200).json({
                message: "Rounds retrieved",
                rounds: fetchedRounds,
                nRounds: count
            });
        });
});

/**
 * GET method that returns the last 20 rounds sorted
 * by the date played
 */
router.get('/lastTwentyRounds', checkAuth, (req, res, next) => {
    let fetchedRounds
    Round.find({creator: req.userData.userId}).sort({date: 'descending'}).limit(20).exec(function(err, documents) { 
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
router.get('/:id', checkAuth,(req, res, next) => {
    Round.findOne({_id: req.params.id, creator: req.userData.userId}).then(round => {
        if (round && round.length !== 0) {
            console.log(round);
            res.status(200).json(round);
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * DELETE method that deletes a round by id.
 * @param id for round id
 */
router.delete("/:id", checkAuth, (req, res, next) => {
    Round.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Update Successful!" });
        } else {
            res.status(401).json({ message: "User Not Authorized!" });
        }
    });
});

module.exports = router;
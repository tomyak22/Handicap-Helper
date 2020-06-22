const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware for Auth
const checkAuth = require('../middleware/check-auth');

/**
 * POST method that signs a user up for Handi-Tracker
 * Encrypts password using bcrypt
 */
router.post('/sign-up', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                handicap: null
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User Created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

/**
 * POST method for logging a user into Handi-Tracker
 * users jsonwebtoken for the token to be sent into the front end
 */
router.post('/sign-in', (req, res, next)=> {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            // fetchedUser is the user that is sent from the front end to be used
            // in the next .then() statement
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    if (!result) {
                        return res.status(401).json({
                            message: "Auth Failed"
                        });
                    }
                    // create jwt with secret from env variable
                    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                        process.env.HANDICAP_SECRET,
                        {expiresIn: '1h'});
                    return res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        userId: fetchedUser._id,
                        firstName: fetchedUser.firstName,
                        lastName: fetchedUser.lastName,
                       // handicap: fetchedUser.handicap
                    });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                });
        });
});

router.get('/handicap', checkAuth, (req, res, next) => {
    let fetchedUser;
    User.findOne({_id: req.userData.userId}).then(user => {
        console.log(user.handicap);
        res.status(200).json({handicap: user.handicap});
    })
});

router.put('/handicap', checkAuth, (req, res, next) => {
    User.findOne({_id: req.userData.userId}).then(user => {
        console.log('This is what is being sent: ' + req.body.handicap);
        user.handicap = req.body.handicap;
        user.save().then(result => {
            res.status(200).json({message: "Handicap Updated!"});
        });
    });
});

module.exports = router;
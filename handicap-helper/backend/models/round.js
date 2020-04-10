const mongoose = require('mongoose');

// creating schema for round
const roundSchema = mongoose.Schema({
    score: {type: Number, required: true},
    course: {type: String, required: true},
    rating: {type: Number, required: true},
    slope: {type: Number, required: true},
    date: {type: String, required: true},
    // imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Round', roundSchema);
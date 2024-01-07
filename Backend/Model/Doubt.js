const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Doubt = mongoose.model('Doubt', doubtSchema);

module.exports = Doubt;

const mongoose = require('mongoose');

const tutorAvailabilitySchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  lastPingTime: {
    type: Date,
    required: true,
  },
});

const TutorAvailability = mongoose.model('TutorAvailability', tutorAvailabilitySchema);

module.exports = TutorAvailability;

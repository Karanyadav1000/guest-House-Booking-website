// roomModel.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

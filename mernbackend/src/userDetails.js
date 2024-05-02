const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginFormPractice")
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.log('failed');
    });

const userDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    roomNumber: {
        type: String, // Assuming room number is stored as a string
        default: '0' // Initially set to 0 indicating no room allotted
    }

});

// Create the UserDetails model
const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = UserDetails;

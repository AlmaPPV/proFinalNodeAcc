const mongoose = require('mongoose');
const driverSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    driverLicense: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('driver', driverSchema);
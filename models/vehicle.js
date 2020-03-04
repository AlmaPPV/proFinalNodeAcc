const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    vehiclesAvailable: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('vehicle', vehicleSchema);
const mongoose = require('mongoose');
const driverVehicleSchema = new mongoose.Schema({
    idDriver: {
        type: String,
        required: true
    },
    idVehicle: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('driverVehicle', driverVehicleSchema);
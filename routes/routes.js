const express = require('express');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const DriverVehicle = require('../models/driver-vehicle');

const router = express.Router();

//Default
router.get('/', async(req, res) => {
    try{
        res.status(200).json({message: "Welcome!!"});
    }catch(error){
        res.status(500),json({message: "Couldn't do anything, sorry, " + error.message});
    };
});

//Get all Drivers
router.get('/drivers', async(req, res) => {
    try{
        //console.log("Query params filter: " + req.query.filter);//leo el query param filter
        //console.log("Query params value: " + req.query.value);//leo el query param value
        filter = req.query.filter;
        value = req.query.value;
       if(typeof filter !== "undefined" || typeof value !== "undefined"){// se que se puede acomodar mejor y está muy largo, pero primero quise que funcionara
           //res.json({message: "filtro o valor tienen valor"});
           if(typeof filter !== "undefined" && typeof value !== "undefined"){
               const drivers = await Driver.find({filter: value});//el find no lee las variables como esperaba...
               res.json({data: {drivers}});
           } else {
               res.status(500).json({message: "One of the params was not provided"});
           }
       } else {//no tiene filtro
           const drivers = await Driver.find();
           res.json({data: {drivers}});
       }
    }catch(error){
        res.status(500).json({message: "Drivers were not found, " + error.message});
    };
})

//Register a driver
router.post('/drivers', async (req, res) => {
    const driver = new Driver({
        age: req.body.age,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        driverLicense: req.body.driverLicense,
        vehicle: req.body.vehicle
    });
    try{
        const newDriver = await driver.save();
        res.status(201).json({data: {newDriver}});
    }catch(error){
        res.status(500).json({message: "New driver couldn't be registered, " + error.message});
    }
});

//Function to be reused; getting an specific driver
async function getDriver(req, res, next){
    try{
        driver = await Driver.findById(req.params.iddriver);
        if(driver === null){
            return res.status(404).json({message: `Driver with the ID ${req.params.iddriver} was not found`});
        }
    }catch(error){
        res.status(500).json({message: "An error has ocurred searching for a driver, " + error.message});
    };
    res.driver = {data: {driver}};
    next();
}

//Get an specific driver
router.get('/drivers/:iddriver', getDriver, async(req, res) => {
    res.json(res.driver);
});

//Delete a driver
router.delete('/drivers/:iddriver', getDriver, async(req, res) => {
    try{
        await res.driver.remove();
        res.json({message: 'The requested driver has been deleted'});
    }catch(error){
        res.status(500).json({message: "An error has ocurred deleting a driver, " + error.message});
    };
});

//Update a driver
router.put('/drivers/:iddriver', async (req, res) => {
    try{
        await Driver.findByIdAndUpdate({_id: req.params.iddriver}, req.body, {new:true});
        res.json({message: "The requested driver was updated"});
    }catch(error){
        res.status(500).json({message: "An error has ocurred updating a driver, " + error.message});
    };
});

//Get all Vehicles
router.get('/vehicles', async(requ, res) => {
    try{
        const vehicles = await Vehicle.find();
        res.json({data: {vehicles}});
    }catch(error){
        res.status(500).json({message: "Vehicles were not found, " + error.message});
    };
});

//Register a vehicle
router.post('/vehicles', async (req, res) => {
    const vehicle = new Vehicle({
        model: req.body.model,
        year: req.body.year,
        vehiclesAvailable: req.body.vehiclesAvailable
    });
    try{
        const newVehicle = await vehicle.save();
        res.status(201).json({data: {newVehicle}});
    }catch(error){
        res.status(500).json({message: "New vehicle couldn't be registered, " + error.message});
    }
});

//NOTE: EN LUGAR DE UNA TERCERA COLECCIÓN, QUE VEHICLE ESTÉ DENTRO DE USER TAMBIÉN, EN UN ARRAY

//Get la info de los vehículos del usuario que te estoy pasando
router.get('/drivers/:iddriver/vehicles', async (req, res) => {
    try{
        driver = await Driver.findById(req.params.iddriver);
        if(driver === null){//no existe el user
            res.status(404).json({message: `Driver with the ID ${req.params.iddriver} was not found`});
        } else if (driver.vehicle != null) {//si el user SI tiene auto
            auto = await Vehicle.findById(driver.vehicle);
            if(auto === null){//no existe el auto
                res.status(404).json({message: `Vehicle with the ID ${driver.vehicle} was not found`});     
            } else {//existe el auto y se lo trae (me falta decirle que solo se traiga lo que quiero mostrar)
                res.json({data: {auto}});
            }
        } else {//no tiene autos
            res.status(404).json({message: `This driver has no vehicles assigned`});
        }
    }catch(error){
        res.status(500).json({message: "An error has ocurred searching for this stuff, " + error.message});
    };
});

//Asignar un vehicle a un driver
router.put('/drivers/:iddriver/vehicles/:idvehicle', async (req, res) => {
    try{
        await Driver.findByIdAndUpdate({_id: req.params.iddriver}, {vehicle: req.params.idvehicle}, {new: true});
        driver = await Driver.findById(req.params.iddriver);
        if(driver === null){
            res.status(404).json({message: `Driver with the ID ${req.params.iddriver} was not found`});
        } else {
            auto = await Vehicle.findById(req.params.idvehicle);
            if(auto === null){
                res.status(404).json({message: `Vehicle with the ID ${req.params.idvehicle} was not found`});
            } else {
                res.json({data: {driver, auto}});
            }
        }
    }catch(error){
        res.status(500).json({message: "An error has ocurred assigning a vehicle to the driver, " + error.message});
    };
});

module.exports = router;




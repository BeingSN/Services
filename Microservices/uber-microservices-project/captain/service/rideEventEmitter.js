// service/rideEventEmitter.js
const EventEmitter = require("events");

class RideEventEmitter extends EventEmitter {}

const rideEventEmitter = new RideEventEmitter();

module.exports = { rideEventEmitter };

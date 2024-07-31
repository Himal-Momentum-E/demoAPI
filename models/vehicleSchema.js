const mongoose = require("mongoose");

const tripDataSchema = new mongoose.Schema({
  tripID: String,
  legType: String,
  dateStart: Date,
  dateEnd: Date,
  batteryAtStart: Number,
  batteryAtEnd: Number,
  dateUpdated: Date,
  tripApprovedKilometer: Number,
  diffInBattery: Number,
  chargingGeo: String,
  chargingLandmark: String,
  chargingType: String,
});

const vehicleSchema = new mongoose.Schema({
  vehicleID: { type: String, required: true, unique: true },
  step1: [tripDataSchema],
  step2: [tripDataSchema],
  step3: [tripDataSchema],
  step4: [tripDataSchema],
  step7: [tripDataSchema],
});

module.exports = mongoose.model("Vehicle", vehicleSchema);

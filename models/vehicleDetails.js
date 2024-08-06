const mongoose = require("mongoose");

const vehicleDetailsSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // Explicitly define _id as ObjectId
    vin: { type: String, required: true, unique: true },
    vehicleId: { type: String, required: true, unique: true },
    make: String,
    model: String,
    year: Number,
    batteryCapacity: Number,
    ownerId: Number, // Assuming ownerID is a numerical identifier
    soc: Number,
    dateOfConnection: Date,
    odometerFloat: Number, // Assuming you want to store floating-point values for odometer
    soh: Number,
  },
  { collection: "vehicleDetails" }
); // Specify the collection name

module.exports = mongoose.model("VehicleDetails", vehicleDetailsSchema);

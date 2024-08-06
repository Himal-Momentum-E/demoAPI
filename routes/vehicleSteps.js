const express = require("express");
const router = express.Router();
const Step1 = require("../models/step1");
const Step2 = require("../models/step2");
const Step3 = require("../models/step3");
// const Step4 = require("../models/step4");
const Step7 = require("../models/step7");
const VehicleDetails = require("../models/vehicleDetails");

router.get("/", async (req, res) => {
  const vehicleId = req.query.vehicleId; // Use req.query for query parameters
  const stepID = req.query.step;

  try {
    if (!vehicleId || !stepID) {
      return res
        .status(400)
        .json({ error: "Missing vehicleId or step query parameters" });
    }

    let data;
    let Model;

    switch (stepID) {
      case "1":
        Model = Step1;
        break;
      case "2":
        Model = Step2;
        break;
      case "3":
        Model = Step3;
        break;
      // case "4":
      //   Model = Step4;
      //   break;
      case "7":
        Model = Step7;
        break;
      default:
        return res.status(400).json({ error: "Invalid step ID" });
    }

    data = await Model.find({ vehicleId }); // Use the dynamically selected model

    if (!data.length) {
      return res
        .status(404)
        .json({ error: "No data found for this vehicle and step" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/allVehiclesStep2", async (req, res) => {
  try {
    const vehicles = await Step2.find();

    if (!vehicles.length) {
      return res.status(404).json({ error: "No vehicles found in Step2" });
    }

    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/allVehiclesStep3", async (req, res) => {
  try {
    // Get all unique vehicleIDs from Step2
    const allVehicleIds = await Step2.distinct("vehicleId");

    // Query Step3 for all the vehicles from Step2, limiting to 5 documents per vehicle
    const vehicles = await Step3.aggregate([
      { $match: { vehicleId: { $in: allVehicleIds } } },
      { $group: { _id: "$vehicleId", data: { $push: "$$ROOT" } } },
      {
        $project: { _id: 0, vehicleId: "$_id", data: { $slice: ["$data", 5] } },
      },
    ]);

    if (!vehicles.length) {
      return res.status(404).json({ error: "No vehicles found in Step3" });
    }

    const flattenedVehicles = vehicles.flatMap((v) => v.data);

    flattenedVehicles.sort((a, b) => b.ClosedDateTime - a.ClosedDateTime);

    res.json(flattenedVehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/allVehiclesStep7", async (req, res) => {
  try {
    const vehicles = await Step7.find();
    
    if (!vehicles.length) {
      return res.status(404).json({ error: "No vehicles found in Step2" });
    }
    
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/allVehicleDetails", async (req, res) => {
  try {
    const vehicles = await VehicleDetails.find();

    if (!vehicles.length) {
      return res
        .status(404)
        .json({ error: "No vehicles found in VehicleDetails" });
    }

    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
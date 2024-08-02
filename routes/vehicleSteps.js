const express = require("express");
const router = express.Router();
const Step1 = require("../models/step1");
const Step2 = require("../models/step2");
const Step3 = require("../models/step3");
// const Step4 = require("../models/step4");
const Step7 = require("../models/step7");

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
    const allVehicleIds = await Step3.distinct("vehicleId"); // Get unique vehicle IDs

    const numVehiclesToSelect = Math.min(4, allVehicleIds.length); // Ensure we don't select more than 8 vehicles

    function getRandomUniqueItems(arr, numItems) {
      if (numItems > arr.length) {
        throw new Error(
          "Cannot get more unique items than the length of the array"
        );
      }
      const shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numItems);
    }

    const selectedVehicleIds = getRandomUniqueItems(
      allVehicleIds,
      numVehiclesToSelect
    );

    const vehicles = await Step3.aggregate([
      { $match: { vehicleId: { $in: selectedVehicleIds } } },
      { $group: { _id: "$vehicleId", data: { $push: "$$ROOT" } } },
      {
        $project: { _id: 0, vehicleId: "$_id", data: { $slice: ["$data", 5] } },
      },
    ]);

    const flattenedVehicles = vehicles.flatMap((v) => v.data); // Flatten the array
    const limitedVehicles = flattenedVehicles.slice(0, 40); // Limit to 40 items

    // if (!vehicles.length) {
    //   return res.status(404).json({ error: "No vehicles found in Step3" });
    // }

    const today = new Date();
    const oneWeekFromToday = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // Add 7 days

    // Helper function to get a random date between two dates
    function getRandomDate(start, end) {
      const timestamp =
        Math.random() * (end.getTime() - start.getTime()) + start.getTime();
      return new Date(timestamp);
    }

    // Add a random futureDate field to each vehicle object
    const vehiclesWithFutureDate = limitedVehicles.map((vehicle) => ({
      ...vehicle,
      dueDate: getRandomDate(today, oneWeekFromToday),
    }));

    vehiclesWithFutureDate.sort((a, b) => b.futureDate - a.futureDate);

    res.json(vehiclesWithFutureDate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

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
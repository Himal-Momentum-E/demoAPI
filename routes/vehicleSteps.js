const express = require("express");
const router = express.Router();
const Step1 = require("../models/step1");
const Step3 = require("../models/step3");

router.get("/", async (req, res) => {
  const vehicleId = req.query.vehicleId; // Use req.query for query parameters
  const stepId = req.query.step;

  try {
    if (!vehicleId || !stepId) {
      return res
        .status(400)
        .json({ error: "Missing vehicleId or step query parameters" });
    }

    let data;
    if (stepId === "1") {
      data = await Step1.find({ vehicleId });
    } else if (stepId === "3") {
      data = await Step3.find({ vehicleId });
    } else {
      return res.status(400).json({ error: "Invalid step ID" });
    }

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

module.exports = router;

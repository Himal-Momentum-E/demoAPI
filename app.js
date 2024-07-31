// app.js
const express = require("express");
const connectDB = require("./config/db");
const vehicleStepRoutes = require("./routes/vehicleSteps"); // Correct import

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/vehicles", vehicleStepRoutes); // Use the imported router

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

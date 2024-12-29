const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const appointmentRoutes = require("./routes/appointments");

const app = express();
const PORT = 5001;

mongoose.set('debug', true);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/appointments?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/appointments", appointmentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

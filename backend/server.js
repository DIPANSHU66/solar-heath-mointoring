const express = require("express");
const cors = require("cors");
const path = require("path");
const modelRoutes = require("./routes/modelRoutes");
const { loadModel } = require("./controllers/modelController");

const app = express();
require("dotenv").config();

// CORS & JSON
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use("/api/model", modelRoutes);
loadModel();

// Serve your built frontend
const publicPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(publicPath));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// index.js
// Minimal Express web service for Render

const express = require("express");
const app = express();

app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "render-webservice",
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Render health check endpoint (if you want to use it)
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Port provided by Render (local fallback to 3000)
//const PORT = process.env.PORT || 3000;
const PORT = 10000;
//const HOST = process.env.HOST || "0.0.0.0"; 
const HOST = "0.0.0.0";   // IMPORTANT for Render


app.listen(PORT, HOST, () => {
  console.log(`Web service running on port ${PORT}`);
});

const express = require("express");
const { getStatus } = require("../controllers/modelController");

const router = express.Router();


router.get("/status", getStatus);

module.exports = router;

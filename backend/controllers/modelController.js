const axios = require("axios");
const csv = require("csv-parse");
const fs = require("fs");
const path = require("path");

let model = null;

require("dotenv").config();




const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const THINGSPEAK_READ_KEY = process.env.THINGSPEAK_READ_KEY;
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.csv?api_key=${THINGSPEAK_READ_KEY}&results=1`;


async function retrainModel() {
  try {
    const response = await axios.get(THINGSPEAK_URL);
    console.log("ThingSpeak Response Status:", response.status); 
    const csvData = response.data;

    csv.parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
      if (err) {
        console.error("CSV Parsing Error:", err);
        return;
      }

      console.log("Parsed CSV Records:", records); 
      if (records.length === 0) {
        console.error("No records found in CSV data.");
        return;
      }

      const data = records.map((record) => ({
        voltage: parseFloat(record.field1),
        current: parseFloat(record.field2) / 1000, 
        irradiance: parseFloat(record.field3),
        temperature: parseFloat(record.field4),
        humidity: parseFloat(record.field5),
        actualPower: parseFloat(record.field6) / 1000, 
      }));

      model = data;
      

      fs.writeFileSync(path.join(__dirname, "../model.json"), JSON.stringify(model));
      console.log("Model retrained and saved successfully.");
    });

  } catch (error) {
    console.error("Error retraining model:", error.message);
  }
}



function loadModel() {
  try {
    const modelData = fs.readFileSync(path.join(__dirname, "../model.json"));
    model = JSON.parse(modelData);
    console.log("Model loaded successfully.");
  } catch (error) {
    console.warn("Model load error:", error.message);
  }
}

function predictPower({ voltage, current, irradiance, temperature, humidity }) {
  return (
    voltage * current * 0.8 + 
    irradiance * 0.001 -
    temperature * 0.01 +
    humidity * 0.002
  );
}


async function getStatus(req, res) {
    try {
      const response = await axios.get(THINGSPEAK_URL);
      const csvData = response.data;
  
      // Parse CSV data using a Promise-based approach
      const records = await new Promise((resolve, reject) => {
        csv.parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
          if (err) {
            reject(new Error("Failed to parse CSV data"));
          } else {
            resolve(records);
          }
        });
      });
  
      if (records.length === 0) {
        return res.status(500).json({ error: "No data found in the CSV" });
      }
  
      // Extract the latest record
      const latest = records[records.length - 1];
      const voltage = parseFloat(latest.field1);
      const current_mA = parseFloat(latest.field2);
      const irradiance = parseFloat(latest.field3);
      const temperature = parseFloat(latest.field4);
      const humidity = parseFloat(latest.field5);
      const actual_power_mW = parseFloat(latest.field6);
  
      // Convert units
      const current = current_mA / 1000; // Convert mA to A
      const actual_power = actual_power_mW / 1000; // Convert mW to W
  
      // Prediction logic
      const predicted_power = predictPower({
        voltage,
        current,
        irradiance,
        temperature,
        humidity,
      });
  
      // Calculate deviation and alert if anomaly
      const deviation = Math.abs(predicted_power - actual_power) / predicted_power;
      const alert = deviation > 0.2; // Anomaly threshold
  
      // Send the response
      return res.json({
        actual_power: Number(actual_power.toFixed(3)),
        predicted_power: Number(predicted_power.toFixed(3)),
        deviation: Number((deviation * 100).toFixed(2)),
        status: alert ? "⚠️ Anomaly" : "Normal",
      });
  
    } catch (err) {
      console.error("Error in getStatus:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }



setInterval(retrainModel, 10 * 60 * 1000);

module.exports = { loadModel, retrainModel, getStatus };

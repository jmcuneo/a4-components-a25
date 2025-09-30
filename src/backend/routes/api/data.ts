import express from 'express';
export const router = express.Router();

// MongoDB Models
import { LogModel as Log } from "../../models/entry.js";

router.get("/data", async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user })
    res.send(JSON.stringify(logs));
  } catch {
    res.status(400).send();
  }
});

router.delete("/data/:battle_id", async (req, res) => {
    try {
      const log = await Log.deleteOne({ user: req.user, battle_id: req.params.battle_id})
      if (log.acknowledged && log.deletedCount < 1) {
        throw new Error("Unable to delete")
      };
      res.contentType("application/json").send(JSON.stringify(log));
    } catch (e) {
      res.status(400).send(e);
    }
});

router.get("/data/:battle_id", async (req, res) => {
    try {
      const log = await Log.findOne({ user: req.user, battle_id: req.params.battle_id})
      res.contentType("application/json").send(JSON.stringify(log));
    } catch (e) {
      res.status(400).send(e);
    }
});

router.post("/data", async (req, res) => {
  try {
    const dataObj = req.body;
  
    const start_year = parseInt(dataObj.start_year) | 0;
    const start_month = parseInt(dataObj.start_month) | 0;
    const start_day = parseInt(dataObj.start_day) | 0;
    const start_hour = parseInt(dataObj.start_hour) | 0;
    const start_minute = parseInt(dataObj.start_minute) | 0;
    const end_year = parseInt(dataObj.end_year) | 0;
    const end_month = parseInt(dataObj.end_month) | 0;
    const end_day = parseInt(dataObj.end_day) | 0;
    const end_hour = parseInt(dataObj.end_hour) | 0;
    const end_minute = parseInt(dataObj.end_minute) | 0;

    const start = new Date(start_year, start_month, start_day, start_hour, start_minute);
    const end = new Date(end_year, end_month, end_day, end_hour, end_minute);
    
    if (dataObj.battle_id == "" || !dataObj.battle_id) {
      dataObj.battle_id = Math.floor(Math.random() * 9999)
    }

    // Insert a document
    const entry = await Log.findOneAndUpdate(
      {user: req.user, battle_id: dataObj.battle_id},
      {
        user: req.user,
        battle_id: dataObj.battle_id,
        my_ship_name: dataObj.my_ship_name,
        my_ship_id: dataObj.my_ship_id,
        opposing_ship_name: dataObj.opposing_ship_name,
        opposing_ship_id: dataObj.opposing_ship_id,
        start: start,
        end: end,
        minute_length: (end.getTime() - start.getTime()) / (1000 * 60), // In minutes
        damage_report: dataObj.damage_report,
      },
      {
        upsert: true,        // Create a new document if one doesn't exist
        new: true,           // Return the updated or newly created document
        setDefaultsOnInsert: true // Apply schema defaults on new document creation
      }
    )

    res.json(entry);
  } catch (e) {
    res.status(400).send(e);
  }
});
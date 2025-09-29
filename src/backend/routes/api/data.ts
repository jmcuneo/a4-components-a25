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
    
    const start = new Date(dataObj.start_year, dataObj.start_month, dataObj.start_day, dataObj.start_hour, dataObj.start_minute);
    const end = new Date(dataObj.end_year, dataObj.end_month, dataObj.end_day, dataObj.end_hour, dataObj.end_minute);
    
    if (dataObj.battle_id == "" || !dataObj.battle_id) {
      dataObj.battle_id = Math.floor(Math.random() * 9999)
    }

    // Insert a document
    await Log.findOneAndUpdate(
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

    res.redirect(303, '/');
  } catch (e) {
    res.status(400).send(e);
  }
});
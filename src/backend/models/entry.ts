import mongoose, { Schema } from 'mongoose';

const LogSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  battle_id: {
    type: String,
    unique: true,
    require: true
  },
  my_ship_name: {
    type: String,
    unique: false
  },
  my_ship_id: {
    type: String,
    unique: false
  },
  opposing_ship_name: {
    type: String,
    unique: false
  },
  opposing_ship_id: {
    type: String,
    unique: false
  },
  start: {
    type: Date,
    unique: false
  },
  end: {
    type: Date,
    unique: false
  },
  minute_length: {
    type: Number,
    unique: false
  },
  damage_report: {
    type: String,
    unique: false
  },
});

export const LogModel = mongoose.model('Log', LogSchema);
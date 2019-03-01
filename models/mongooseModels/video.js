'use strict';
// import the necessary modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MODEL_NAME = "video"; // Mongoose will look for collection with plural of this

mongoose.set("debug",true);
const VideoSchema = new Schema({
    video_id:{
      type: Number,
      required: true,
      unique: true,
        },
    title: {
        type: String,
        required: true
      },
    gen_id: { 
        type: Number, 
        required: true 
        },
    user_id: {
        type: Number,
        required: true
          },
    year_release: {
        type: Number,
        required: true,
        },
  created_at: {
    type: Date,
    default: Date.now
  } 
});

mongoose.model(MODEL_NAME, VideoSchema);


module.exports = {
  model: mongoose.model(MODEL_NAME)
};
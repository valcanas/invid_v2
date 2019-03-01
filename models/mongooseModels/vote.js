const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MODEL_NAME = "vote"; // Mongoose will look for collection with plural of this

mongoose.set("debug",true);
const votoSchema = new Schema({
  id_video: {
    type: Number,
  },
  user_vote: {
    type: Number,
      },
  date_vote: {
    type: Date,
    default: Date.now
  },
  star_vote: Number,
});

mongoose.model(MODEL_NAME, votoSchema);



// Export the model
module.exports = {
  model: mongoose.model(MODEL_NAME)
};
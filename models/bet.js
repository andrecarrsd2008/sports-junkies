const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const betSchema = new Schema({
    typeOfBet: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: false },
    currentLine: { type: String, required: true },
    key: { type: String, required: true },
    
    date: { type: Date, default: Date.now }
  });
  
  const Bet = mongoose.model("Bet", betSchema);
  
  module.exports = Bet;
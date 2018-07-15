const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const betSchema = new Schema({
    typeOfBet: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: false },
    team1Line: { type: String, required: true},
    team2Line: { type: String, required: false },
    key: { type: String, required: true },   
    date: { type: String, required: false }
  });
  
  const Bet = mongoose.model("Bet", betSchema);
  
  module.exports = Bet;
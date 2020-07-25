const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var transaction = new Schema({
    fromTodai: { type: String, required: true },
    fromToeth: { type: String, required: true },
    fromTousdc: { type: String, required: true },
    Daiamount: { type: Number, required: true },
    Ethamount: { type: Number, required: true },
    Usdcamount: { type: Number, required: true },
},{
    timestamps: true
});

var userSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    Dai: { type: Number, default: 0 },
    Eth: { type: Number, default: 0 },
    USDC: { type: Number, default: 0 },
    trans: { type: [transaction] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
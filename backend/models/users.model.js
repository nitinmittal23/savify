const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var transaction = new Schema({
    fromTo: { type: String, required: true },
    amount: { type: Number, required: true }
},{
    timestamps: true
});

var userSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    protocol: {type: String, default: "None"},
    Dai: { type: Number, default: 0 },
    Eth: { type: Number, default: 0 },
    USDC: { type: Number, default: 0 },
    trans: { type: [transaction] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
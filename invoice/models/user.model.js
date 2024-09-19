const mongoose = require('mongoose');
const collectionEnum = require("../../enum/collection.enum");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model(collectionEnum.USER, userSchema);

const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Music', musicSchema);

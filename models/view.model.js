const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
    isChecked: {
        type: Boolean,
        default: false
    },
    checkedAt: {
        type: Date,
        default: null
    },
    ipAddress: {
        type: String,
        default: 'Unknown'
    },
    browserInfo: {
        type: String,
        default: 'Unknown'
    }
}, { timestamps: true });

module.exports = mongoose.models.View || mongoose.model("View", viewSchema);
const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    isDownloaded: {
        type: Boolean,
        default: false
    },
    downloadStatus: {
        type: String,
        default: 'successful'
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

module.exports = mongoose.models.Download || mongoose.model('Download', downloadSchema);

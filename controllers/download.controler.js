const Download = require('../models/download.model');

const getAllDownloads = async (req, res) => {
    try {
        const list = await Download.find().sort({ createdAt: -1 });
        const count = await Download.countDocuments();

        const groupedByDate = await Download.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    entries: { $push: "$$ROOT" }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        res.json({ count, list, groupedByDate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const trackDownload = async (req, res) => {
    try {
        const { isDownloaded, downloadStatus, ipAddress, browserInfo } = req.body;
        
        const downloaded = isDownloaded === true || isDownloaded === 'true';

        const newDownload = new Download({
            isDownloaded: downloaded,
            downloadStatus: downloadStatus || (downloaded ? 'successful' : 'failed'),
            ipAddress: ipAddress || 'Unknown',
            browserInfo: browserInfo || 'Unknown'
        });

        await newDownload.save();

        res.status(201).json(newDownload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllDownloads,
    trackDownload
};

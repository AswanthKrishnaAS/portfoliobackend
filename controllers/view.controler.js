const View = require("../models/view.model");

const getViews = async (req, res) => {
    try {
        const list = await View.find().sort({ createdAt: -1 });
        const count = await View.countDocuments();
        
        const groupedByDate = await View.aggregate([
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

const updateView = async (req, res) => {
    try {
        const { isChecked, ipAddress, browserInfo } = req.body;
        // Parse isChecked if it comes as a string
        const checked = isChecked === true || isChecked === 'true';

        const data = new View({
            isChecked: checked,
            checkedAt: checked ? new Date() : null,
            ipAddress: ipAddress || 'Unknown',
            browserInfo: browserInfo || 'Unknown'
        });

        await data.save();

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getViews,
    updateView
};
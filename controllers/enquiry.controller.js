const Enquiry = require("../models/enquiry.model");

// GET all enquiries
const getEnquiries = async (req, res) => {
    try {
        const list = await Enquiry.find().sort({ createdAt: -1 });
        const count = await Enquiry.countDocuments();
        const newCount = await Enquiry.countDocuments({ status: 'new' });
        res.json({ list, count, newCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create enquiry
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required" });
        }

        const enquiry = new Enquiry({
            name,
            email,
            phone: phone || '',
            message,
            status: 'new'
        });

        await enquiry.save();
        res.status(201).json(enquiry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH update status
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Enquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE enquiry
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Enquiry.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        res.json({ message: "Enquiry deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getEnquiries,
    createEnquiry,
    updateStatus,
    deleteEnquiry
};

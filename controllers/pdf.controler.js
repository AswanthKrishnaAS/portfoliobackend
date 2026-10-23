const multer = require('multer');
const path = require('path');
const Pdf = require('../models/pdf.model');
const fs = require('fs');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('pdf');

const uploadPdf = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        try {
            // Find all existing PDFs to clean up disk
            const existingPdfs = await Pdf.find();
            
            for (const oldPdf of existingPdfs) {
                const oldPath = path.join(__dirname, '..', oldPdf.path);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Remove all existing records from DB
            await Pdf.deleteMany({});

            const normalizedPath = req.file.path.replace(/\\/g, '/');

            const newPdf = new Pdf({
                filename: req.file.filename,
                path: normalizedPath,
                originalName: req.file.originalname,
                isActive: true
            });

            await newPdf.save();
            res.status(201).json({ message: 'CV updated successfully. Old files deleted.', pdf: newPdf });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const getActivePdf = async (req, res) => {
    try {
        const pdf = await Pdf.findOne({ isActive: true }).sort({ uploadedAt: -1 });
        if (!pdf) {
            return res.status(404).json({ error: 'No active PDF found' });
        }
        res.json(pdf);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find().sort({ uploadedAt: -1 });
        res.json(pdfs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteActivePdf = async (req, res) => {
    try {
        const pdfs = await Pdf.find();
        for (const pdf of pdfs) {
            const oldPath = path.join(__dirname, '..', pdf.path);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        await Pdf.deleteMany({});
        res.json({ message: 'Active CV deleted successfully from disk and server.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const viewPdfFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const safeFilename = path.basename(filename);
        const filePath = path.join(__dirname, '..', 'uploads', safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': stat.size,
            'Content-Disposition': `inline; filename="${encodeURIComponent(safeFilename)}"`
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const viewActivePdf = async (req, res) => {
    try {
        const pdf = await Pdf.findOne({ isActive: true }).sort({ uploadedAt: -1 });
        if (!pdf) {
            return res.status(404).json({ error: 'No active PDF found' });
        }

        const safeFilename = path.basename(pdf.filename || pdf.path);
        const filePath = path.join(__dirname, '..', 'uploads', safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on disk' });
        }

        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': stat.size,
            'Content-Disposition': `inline; filename="${encodeURIComponent(pdf.originalName || safeFilename)}"`
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    uploadPdf,
    getActivePdf,
    getAllPdfs,
    deleteActivePdf,
    viewPdfFile,
    viewActivePdf
};

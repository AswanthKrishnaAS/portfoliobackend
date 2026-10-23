const multer = require('multer');
const path = require('path');
const Music = require('../models/Music');
const fs = require('fs');

// Multer Config for Music
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/music/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'music-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp3|wav|ogg|mpeg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only audio files (mp3, wav, ogg) are allowed!'), false);
    }
}).single('music');

const uploadMusic = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a music file' });
        }

        try {
            const newMusic = new Music({
                filename: req.file.filename,
                path: req.file.path,
                originalName: req.file.originalname,
                size: req.file.size
            });

            await newMusic.save();
            res.status(201).json({ message: 'Music uploaded successfully', music: newMusic });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

const getAllMusic = async (req, res) => {
    try {
        const musicList = await Music.find().sort({ uploadedAt: -1 });
        res.json(musicList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);
        if (!music) {
            return res.status(404).json({ error: 'Music not found' });
        }

        const filePath = path.join(__dirname, '..', music.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Music.findByIdAndDelete(req.params.id);
        res.json({ message: 'Music deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMusic = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a music file' });
        }

        try {
            // Find and delete all existing music files from disk
            const existingTracks = await Music.find();
            for (const track of existingTracks) {
                const oldPath = path.join(__dirname, '..', track.path);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Remove all existing records from DB
            await Music.deleteMany({});

            const newMusic = new Music({
                filename: req.file.filename,
                path: req.file.path,
                originalName: req.file.originalname,
                size: req.file.size
            });

            await newMusic.save();
            res.status(200).json({ message: 'Music track updated successfully. Old files cleared.', music: newMusic });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

module.exports = {
    uploadMusic,
    getAllMusic,
    deleteMusic,
    updateMusic
};

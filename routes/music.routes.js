const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controler');

router.post('/upload', musicController.uploadMusic);
router.get('/list', musicController.getAllMusic);
router.put('/update', musicController.updateMusic);
router.delete('/:id', musicController.deleteMusic);

module.exports = router;

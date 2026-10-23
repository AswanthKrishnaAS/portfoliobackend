const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/download.controler');

router.get('/', downloadController.getAllDownloads);
router.post('/', downloadController.trackDownload);

module.exports = router;

const express = require('express');
const router = express.Router();
const { uploadPdf, getActivePdf, getAllPdfs, deleteActivePdf, viewPdfFile, viewActivePdf } = require('../controllers/pdf.controler');

router.post('/upload', uploadPdf);
router.get('/active', getActivePdf);
router.get('/active/view', viewActivePdf);
router.get('/view/:filename', viewPdfFile);
router.get('/list', getAllPdfs);
router.delete('/active', deleteActivePdf);

module.exports = router;

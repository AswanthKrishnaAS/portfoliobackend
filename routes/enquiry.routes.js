const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiry.controller");

router.get("/", enquiryController.getEnquiries);
router.post("/", enquiryController.createEnquiry);
router.patch("/:id/status", enquiryController.updateStatus);
router.delete("/:id", enquiryController.deleteEnquiry);

module.exports = router;

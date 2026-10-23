const express = require("express");
const router = express.Router();
const viewController = require("../controllers/view.controler");

router.get("/", viewController.getViews);
router.post("/", viewController.updateView);

module.exports = router;
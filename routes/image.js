const express = require("express");
const upload = require("../config/multer");
const imageController = require("../controller/imageController");

const router = express.Router();

router.post("/compress", upload.single("image"), imageController.compressImage);

module.exports = router;

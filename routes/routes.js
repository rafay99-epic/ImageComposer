const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.render("pages/index", { title: "Image Composer" });
});

router.get("/terms", (req, res) => {
  res.render("pages/terms", { title: "Image Composer" });
});

router.get("/privacy", (req, res) => {
  res.render("pages/privacy", { title: "Image Composer" });
});

module.exports = router;

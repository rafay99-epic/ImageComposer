const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static("public"));

app.post("/compress", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }

  try {
    const quality = parseInt(req.body.quality) || 75;

    const buffer = await sharp(req.file.buffer)
      .jpeg({ quality: quality, mozjpeg: true })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error compressing image.");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

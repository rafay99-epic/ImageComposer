const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
        )
      );
    }
  },
});

app.use(express.static("public"));

app.post("/compress", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded.");
  }

  const quality = parseInt(req.body.quality);
  if (isNaN(quality) || quality < 0 || quality > 100) {
    return res
      .status(400)
      .send("Invalid quality value. Must be between 0 and 100.");
  }

  const outputFormat = req.body.format;
  const allowedFormats = ["jpeg", "png", "webp"];
  if (!allowedFormats.includes(outputFormat)) {
    return res
      .status(400)
      .send("Invalid output format.  Must be jpeg, png, or webp.");
  }

  const roundedCorners = req.body.roundedCorners === "true";

  let roundedCornerRadius = parseInt(req.body.cornerRadius);
  if (isNaN(roundedCornerRadius) || roundedCornerRadius < 0) {
    roundedCornerRadius = 0;
  }

  try {
    let sharpImage = sharp(req.file.buffer);

    switch (outputFormat) {
      case "jpeg":
        sharpImage = sharpImage.jpeg({ quality: quality, mozjpeg: true });
        res.set("Content-Type", "image/jpeg");
        break;
      case "png":
        sharpImage = sharpImage.png({ quality: quality });
        res.set("Content-Type", "image/png");
        break;
      case "webp":
        sharpImage = sharpImage.webp({ quality: quality });
        res.set("Content-Type", "image/webp");
        break;
      default:
        return res.status(400).send("Invalid output format");
    }

    if (roundedCorners && roundedCornerRadius > 0) {
      const metadata = await sharpImage.metadata();
      const width = metadata.width;
      const height = metadata.height;

      const roundedCornersSvg = Buffer.from(
        `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${roundedCornerRadius}" ry="${roundedCornerRadius}"/></svg>`
      );

      sharpImage = sharpImage.composite([
        {
          input: roundedCornersSvg,
          blend: "dest-in",
        },
      ]);

      if (outputFormat !== "png") {
        sharpImage = sharpImage.png();
        res.set("Content-Type", "image/png");
      }
    }

    const buffer = await sharpImage.toBuffer();
    res.send(buffer);
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).send("Error compressing image.");
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});
app.use((err, req, res, next) => {
  console.error("Global error handler caught an error:", err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .send("Sorry, the image size exceeds the 30MB limit.");
    }
    return res.status(400).send(`Multer error: ${err.message}`);
  }

  if (
    err.message ===
    "Too many requests from this IP, please try again after 15 minutes"
  ) {
    return res.status(429).send(err.message);
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).send("CORS error: Request blocked");
  }

  res.status(500).send("Something went wrong on the server.");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

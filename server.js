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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
      },
    },
  })
);
const allowedOrigins = [
  "https://imagecomposer.onrender.com",
  "https://imagecomposer-production.up.railway.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "POST",
    optionsSuccessStatus: 200,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(hpp());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
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

  try {
    let buffer;
    switch (outputFormat) {
      case "jpeg":
        buffer = await sharp(req.file.buffer)
          .jpeg({ quality: quality, mozjpeg: true })
          .toBuffer();
        res.set("Content-Type", "image/jpeg");
        break;
      case "png":
        buffer = await sharp(req.file.buffer)
          .png({ quality: quality })
          .toBuffer();
        res.set("Content-Type", "image/png");
        break;
      case "webp":
        buffer = await sharp(req.file.buffer)
          .webp({ quality: quality })
          .toBuffer();
        res.set("Content-Type", "image/webp");
        break;
      default:
        return res.status(400).send("Invalid output format");
    }

    res.send(buffer);
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).send("Error compressing image.");
  }
});

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.use((err, req, res, next) => {
  console.error("Global error handler caught an error:", err.stack);

  if (err instanceof multer.MulterError) {
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

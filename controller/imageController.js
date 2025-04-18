const sharp = require("sharp");

async function compressImage(req, res, next) {
  if (!req.file) {
    return res.status(400).send("No image uploaded or invalid file type.");
  }

  try {
    const quality = parseInt(req.body.quality);
    if (isNaN(quality) || quality < 1 || quality > 100) {
      return res
        .status(400)
        .send("Invalid quality value. Must be between 1 and 100.");
    }

    const outputFormat = req.body.format || "jpeg";
    const allowedFormats = ["jpeg", "png", "webp"];
    if (!allowedFormats.includes(outputFormat)) {
      return res
        .status(400)
        .send("Invalid output format. Must be jpeg, png, or webp.");
    }

    const roundedCorners = req.body.roundedCorners === "true";
    let roundedCornerRadius = parseInt(req.body.cornerRadius);
    if (isNaN(roundedCornerRadius) || roundedCornerRadius < 0) {
      roundedCornerRadius = 0;
    }

    let sharpImage = sharp(req.file.buffer);
    let contentType = `image/${outputFormat}`;

    switch (outputFormat) {
      case "jpeg":
        sharpImage = sharpImage.jpeg({ quality: quality, mozjpeg: true });
        break;
      case "png":
        const pngCompressionLevel = Math.max(0, 9 - Math.floor(quality / 11));
        sharpImage = sharpImage.png({
          compressionLevel: pngCompressionLevel,
          quality: quality,
        });
        break;
      case "webp":
        sharpImage = sharpImage.webp({ quality: quality });
        break;
    }

    if (roundedCorners && roundedCornerRadius > 0) {
      const metadata = await sharpImage.metadata();
      if (metadata.width && metadata.height) {
        const width = metadata.width;
        const height = metadata.height;
        const svgRoundedRect = Buffer.from(
          `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${roundedCornerRadius}" ry="${roundedCornerRadius}"/></svg>`
        );
        sharpImage = sharpImage.composite([
          { input: svgRoundedRect, blend: "dest-in" },
        ]);

        if (outputFormat === "jpeg") {
          sharpImage = sharpImage.png();
          contentType = "image/png";
        }
      } else {
        console.warn(
          "Could not get image dimensions for applying rounded corners."
        );
      }
    }

    res.set("Content-Type", contentType);
    const buffer = await sharpImage.toBuffer();
    res.send(buffer);
  } catch (error) {
    console.error("Image processing error:", error);
    next(new Error("Error processing image."));
  }
}

module.exports = {
  compressImage,
};

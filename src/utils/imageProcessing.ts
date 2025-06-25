export interface CompressionOptions {
  quality: number;
  format: "jpeg" | "png" | "webp";
  maxWidth: number;
  maxHeight: number;
}

/**
 * Compresses an image using the browser's canvas API
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions
): Promise<string> => {
  const {
    quality = 0.8,
    format = "jpeg",
    maxWidth = 2000,
    maxHeight = 2000,
  } = options;

  // Create an image element
  const img = new Image();
  img.src = await readFileAsDataURL(file);
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Calculate new dimensions while maintaining aspect ratio
  const { width, height } = calculateDimensions(
    img.width,
    img.height,
    maxWidth,
    maxHeight
  );

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  // Draw image onto canvas
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0, width, height);

  // Convert to desired format
  const mimeType = `image/${format}`;
  return canvas.toDataURL(mimeType, quality);
};

/**
 * Applies rounded corners to an image
 */
export const applyRoundedCorners = async (
  dataUrl: string,
  radius: number
): Promise<string> => {
  // Create an image element
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Get context and draw rounded rectangle
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.save();

  // Create rounded rectangle path
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(canvas.width - radius, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
  ctx.lineTo(canvas.width, canvas.height - radius);
  ctx.quadraticCurveTo(
    canvas.width,
    canvas.height,
    canvas.width - radius,
    canvas.height
  );
  ctx.lineTo(radius, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  // Clip to the rounded rectangle and draw image
  ctx.clip();
  ctx.drawImage(img, 0, 0);
  ctx.restore();

  return canvas.toDataURL("image/png"); // Use PNG to preserve transparency
};

/**
 * Reads a file as a data URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Calculates new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

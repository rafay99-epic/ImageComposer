import toast from "react-hot-toast";

export interface ManualEnhancementSettings {
  sharpness: number;
  denoise: number;
  brightness: number;
  contrast: number;
  saturation: number;
  upscaleFactor: number;
}

export const defaultSettings: ManualEnhancementSettings = {
  sharpness: 50,
  denoise: 50,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  upscaleFactor: 1,
};

export async function enhanceImage(
  imageUrl: string,
  settings: ManualEnhancementSettings
): Promise<string> {
  try {
    // Create and load image
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // Set dimensions based on upscale factor
    canvas.width = img.width * settings.upscaleFactor;
    canvas.height = img.height * settings.upscaleFactor;

    // Apply filters
    ctx.filter = `
      brightness(${settings.brightness}%)
      contrast(${settings.contrast}%)
      saturate(${settings.saturation}%)
      blur(${settings.denoise / 10}px)
    `;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Apply sharpness if needed
    if (settings.sharpness > 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = new Uint8ClampedArray(imageData.data);
      // Apply unsharp masking algorithm
      const sharpenFactor = settings.sharpness / 100;
      for (let i = 0; i < data.length - 4; i += 4) {
        const r = data[i] as number;
        const g = data[i + 1] as number;
        const b = data[i + 2] as number;
        data[i] = Math.min(255, r + (r - 128) * sharpenFactor);
        data[i + 1] = Math.min(255, g + (g - 128) * sharpenFactor);
        data[i + 2] = Math.min(255, b + (b - 128) * sharpenFactor);
      }
      imageData.data.set(data);
      ctx.putImageData(imageData, 0, 0);
    }

    // Return enhanced image URL
    return canvas.toDataURL("image/jpeg", 0.95);
  } catch (error) {
    console.error("Manual enhancement failed:", error);
    throw error;
  }
}

export async function enhanceMultipleImages(
  images: { url: string; selected: boolean }[],
  settings: ManualEnhancementSettings,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const enhancedUrls: string[] = new Array(images.length).fill("");
  let processed = 0;

  for (const [i, image] of images.entries()) {
    if (!image.selected) continue;

    try {
      enhancedUrls[i] = await enhanceImage(image.url, settings);
      processed++;
      onProgress?.(processed, images.filter((img) => img.selected).length);
    } catch (error) {
      console.error(`Failed to enhance image ${i}:`, error);
      toast.error(`Failed to enhance image ${i + 1}`, {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
    }
  }

  return enhancedUrls;
}

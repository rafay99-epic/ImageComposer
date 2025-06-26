import toast from "react-hot-toast";

export interface AIEnhancementOptions {
  upscale?: boolean;
  faceEnhance?: boolean;
  removeNoise?: boolean;
  improveDetail?: boolean;
  prompt?: string;
  negativePrompt?: string;
}

interface ReplicateResponse {
  id: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  created_at: string;
  completed_at: string | null;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  input: Record<string, any>;
  output: string[] | null;
  error: string | null;
  logs: string;
  metrics: {
    predict_time: number;
    total_time: number;
  };
  webhook_completed: string | null;
}

// Available models
const MODELS = {
  REAL_ESRGAN: {
    id: "nightmareai/real-esrgan",
    version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    description: "Fast upscaling, good for small images and removing artifacts",
  },
  CONTROLNET_TILE: {
    id: "batouresearch/high-resolution-controlnet-tile",
    version: "3b5c0222e7a6054bfc0136170f92d576ed55c5eb5c87cbc2c1e99d777fec0102",
    description:
      "High quality upscaling with detail enhancement, best for larger images",
  },
};

class AIEnhancementError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "AIEnhancementError";
  }
}

async function waitForPrediction(
  predictionId: string
): Promise<ReplicateResponse> {
  const maxAttempts = 60;
  const pollingInterval = 1000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`/api/replicate?id=${predictionId}`);
    if (!response.ok) {
      throw new AIEnhancementError(
        "Failed to check prediction status",
        await response.text()
      );
    }

    const prediction = await response.json();
    console.log("Prediction status:", prediction.status);

    if (prediction.status === "succeeded") {
      return prediction;
    } else if (prediction.status === "failed") {
      throw new AIEnhancementError(
        "AI enhancement failed",
        prediction.error || prediction.logs || "No error details available"
      );
    }

    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    attempts++;
  }

  throw new AIEnhancementError(
    "Prediction timeout",
    "The enhancement process took too long to complete"
  );
}

async function getImageDimensions(
  imageUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

export async function enhanceImageWithAI(
  imageUrl: string,
  options: AIEnhancementOptions = {}
): Promise<string> {
  try {
    if (!imageUrl) {
      throw new AIEnhancementError("No image provided");
    }

    // Clean up base64 data
    const base64Data = imageUrl.startsWith("data:")
      ? imageUrl.split(",")[1]
      : imageUrl;

    // Get image dimensions to determine best model
    const dimensions = await getImageDimensions(imageUrl);
    console.log("Image dimensions:", dimensions);

    // Select appropriate model based on image characteristics
    const isSmallImage = dimensions.width < 512 || dimensions.height < 512;
    const selectedModel = isSmallImage
      ? MODELS.REAL_ESRGAN
      : MODELS.CONTROLNET_TILE;

    console.log("Selected model:", {
      name: selectedModel.id,
      reason: isSmallImage
        ? "Small image, using fast upscaler"
        : "Larger image, using high-quality upscaler",
      dimensions,
    });

    // Prepare model-specific input
    let modelInput;
    if (selectedModel === MODELS.REAL_ESRGAN) {
      modelInput = {
        img: base64Data,
        scale: options.upscale ? 4 : 2,
        face_enhance: options.faceEnhance,
        denoise_strength: options.removeNoise ? 0.5 : 0,
      };
    } else {
      modelInput = {
        image: base64Data,
        prompt:
          options.prompt ||
          "enhance this image with more details and better quality",
        negative_prompt:
          options.negativePrompt || "blur, noise, artifacts, distortion",
        steps: 20,
        denoise: 0.4,
        upscale_by: options.upscale ? 2 : 1.5,
        scheduler: "karras",
        controlnet_strength: 1,
        guidance_scale: 7.5,
      };
    }

    console.log("Enhancement parameters:", {
      model: selectedModel.id,
      ...modelInput,
      img: modelInput.img ? "base64_data..." : undefined,
      image: modelInput.image ? "base64_data..." : undefined,
    });

    // Start the prediction
    const startResponse = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: selectedModel.version,
        input: modelInput,
      }),
    });

    if (!startResponse.ok) {
      let errorText;
      try {
        const errorJson = await startResponse.json();
        errorText = JSON.stringify(errorJson);
      } catch {
        errorText = await startResponse.text();
      }
      console.error("API Error Response:", errorText);
      throw new AIEnhancementError("Failed to start AI enhancement", errorText);
    }

    const prediction = await startResponse.json();
    console.log("Started enhancement:", {
      id: prediction.id,
      model: selectedModel.id,
    });

    // Wait for completion
    const result = await waitForPrediction(prediction.id);
    console.log("Enhancement completed:", {
      processingTime: result.metrics?.predict_time,
      totalTime: result.metrics?.total_time,
    });

    if (result.error) {
      throw new AIEnhancementError("AI model error", result.error);
    }

    if (!result.output || typeof result.output !== "string") {
      console.error("Unexpected output format:", result.output);
      throw new AIEnhancementError(
        "Invalid output format",
        `Expected output URL but got ${typeof result.output}`
      );
    }

    return result.output;
  } catch (error) {
    console.error("AI Enhancement error:", {
      name: error instanceof Error ? error.name : "Unknown Error",
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof AIEnhancementError ? error.details : undefined,
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}

export async function processImageWithAI(
  file: File,
  options: AIEnhancementOptions = {}
): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new AIEnhancementError(
        "No file provided",
        "Please select an image file"
      );
    }

    if (!file.type.startsWith("image/")) {
      throw new AIEnhancementError(
        "Invalid file type",
        `Expected image file but got ${file.type}`
      );
    }

    // Show loading toast
    const loadingToast = toast.loading(
      "🤖 AI is analyzing and enhancing your image...",
      {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      }
    );

    try {
      // Convert File to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert image to base64"));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      // Process the image
      const enhancedImageUrl = await enhanceImageWithAI(base64, options);

      // Success toast
      toast.dismiss(loadingToast);
      toast.success("✨ AI enhancement complete!", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      });

      return enhancedImageUrl;
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);

      let errorMessage = "AI enhancement failed";
      let details = "";

      if (error instanceof AIEnhancementError) {
        errorMessage = error.message;
        details = error.details;
      } else if (error instanceof Error) {
        details = error.message;
      }

      toast.error(`❌ ${errorMessage}${details ? `: ${details}` : ""}`, {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
        duration: 5000, // Show error for longer
      });

      throw error;
    }
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

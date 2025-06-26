import toast from "react-hot-toast";

export interface AIEnhancementOptions {
  upscale?: boolean;
  faceEnhance?: boolean;
  removeNoise?: boolean;
  improveDetail?: boolean;
}

interface ReplicateResponse {
  completed_at: string;
  created_at: string;
  error: string | null;
  id: string;
  input: Record<string, any>;
  logs: string;
  metrics: {
    predict_time: number;
    total_time: number;
  };
  output: string;
  status: "starting" | "processing" | "succeeded" | "failed";
  urls: {
    get: string;
    cancel: string;
  };
}

class AIEnhancementError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "AIEnhancementError";
  }
}

async function waitForPrediction(
  predictionId: string
): Promise<ReplicateResponse> {
  const maxAttempts = 60; // Maximum number of polling attempts
  const pollingInterval = 1000; // Polling interval in milliseconds
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
    if (prediction.status === "succeeded") {
      return prediction;
    } else if (prediction.status === "failed") {
      throw new AIEnhancementError(
        "AI enhancement failed",
        prediction.error || prediction.logs || "No error details available"
      );
    }

    // Wait before next polling attempt
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    attempts++;
  }

  throw new AIEnhancementError(
    "Prediction timeout",
    "The enhancement process took too long to complete"
  );
}

export async function enhanceImageWithAI(
  imageUrl: string,
  options: AIEnhancementOptions = {}
): Promise<string> {
  try {
    // Validate input image
    if (!imageUrl) {
      throw new AIEnhancementError(
        "No image provided",
        "The image URL or base64 data is empty"
      );
    }

    // Prepare the input parameters
    const input = {
      image: imageUrl,
      prompt: "enhance this image with more details and better quality",
      scale: options.upscale ? 2 : 1,
      face_enhance: options.faceEnhance,
      denoise: options.removeNoise ? "medium" : "none",
      enhance_detail: options.improveDetail,
      safety_filter_level: "block_medium_and_above",
    };

    console.log("AI Enhancement input:", {
      ...input,
      image: imageUrl.substring(0, 100) + "...", // Truncate for logging
    });

    // Start the prediction using our API route
    const startResponse = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        input,
      }),
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      throw new AIEnhancementError("Failed to start AI enhancement", errorText);
    }

    const prediction = await startResponse.json();
    console.log("Started prediction:", prediction.id);

    // Wait for the prediction to complete
    const result = await waitForPrediction(prediction.id);
    console.log("AI Enhancement response:", {
      ...result,
      input: undefined, // Exclude input from logging
    });

    // Validate the result
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
    // Log the full error for debugging
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

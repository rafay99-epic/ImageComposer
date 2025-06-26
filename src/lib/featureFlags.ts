export interface FeatureFlags {
  // Core Features
  imageCompression: boolean;
  svgConverter: boolean;
  manualEnhancement: boolean;
  aiEnhancement: boolean;

  // Enhancement Features
  enhancementPresets: boolean;
  batchProcessing: boolean;
  socialSharing: boolean;

  // Image Processing Features
  sharpnessAdjustment: boolean;
  noiseReduction: boolean;
  colorAdjustments: boolean;
  upscaling: boolean;

  // Format Support
  jpegSupport: boolean;
  pngSupport: boolean;
  webpSupport: boolean;
  svgSupport: boolean;

  // UI Features
  darkMode: boolean;
  responsiveDesign: boolean;
  dragAndDrop: boolean;
  previewMode: boolean;
}

// Configuration - Just change these values to enable/disable features
const defaultFeatureFlags: FeatureFlags = {
  // Core Features
  imageCompression: true,
  svgConverter: true,
  manualEnhancement: true,
  aiEnhancement: true, // Requires API key

  // Enhancement Features
  enhancementPresets: true,
  batchProcessing: true,
  socialSharing: true,

  // Image Processing Features
  sharpnessAdjustment: true,
  noiseReduction: true,
  colorAdjustments: true,
  upscaling: true,

  // Format Support
  jpegSupport: true,
  pngSupport: true,
  webpSupport: true,
  svgSupport: true,

  // UI Features
  darkMode: true,
  responsiveDesign: true,
  dragAndDrop: true,
  previewMode: true,
};

// Current feature flags state
export let featureFlags = { ...defaultFeatureFlags };

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature];
}

// Get current feature flags
export function getFeatureFlags(): FeatureFlags {
  return { ...featureFlags };
}

// Update feature flags
export function updateFeatureFlags(
  updates: Partial<FeatureFlags>
): FeatureFlags {
  featureFlags = { ...featureFlags, ...updates };
  return getFeatureFlags();
}

// Reset feature flags to default
export function resetFeatureFlags(): FeatureFlags {
  featureFlags = { ...defaultFeatureFlags };
  return getFeatureFlags();
}

// Feature descriptions
const descriptions: Record<keyof FeatureFlags, string> = {
  imageCompression: "Compress images while maintaining quality",
  svgConverter: "Convert raster images to SVG format",
  manualEnhancement: "Manual image enhancement controls",
  aiEnhancement: "AI-powered image enhancement",
  enhancementPresets: "Pre-defined enhancement settings",
  batchProcessing: "Process multiple images at once",
  socialSharing: "Share results on social media",
  sharpnessAdjustment: "Adjust image sharpness",
  noiseReduction: "Reduce image noise",
  colorAdjustments: "Adjust image colors",
  upscaling: "Upscale image resolution",
  jpegSupport: "Support for JPEG format",
  pngSupport: "Support for PNG format",
  webpSupport: "Support for WebP format",
  svgSupport: "Support for SVG format",
  darkMode: "Dark mode interface",
  responsiveDesign: "Responsive layout",
  dragAndDrop: "Drag and drop file upload",
  previewMode: "Preview changes in real-time",
};

// Get feature description
export function getFeatureDescription(feature: keyof FeatureFlags): string {
  return descriptions[feature];
}

// Feature categories
const categories: Record<string, Array<keyof FeatureFlags>> = {
  "Core Features": [
    "imageCompression",
    "svgConverter",
    "manualEnhancement",
    "aiEnhancement",
  ],
  Enhancement: ["enhancementPresets", "batchProcessing", "socialSharing"],
  "Image Processing": [
    "sharpnessAdjustment",
    "noiseReduction",
    "colorAdjustments",
    "upscaling",
  ],
  "Format Support": ["jpegSupport", "pngSupport", "webpSupport", "svgSupport"],
  "UI Features": ["darkMode", "responsiveDesign", "dragAndDrop", "previewMode"],
};

// Get feature categories
export function getFeatureCategories(): typeof categories {
  return categories;
}

// Check if feature requires API key
export function doesFeatureRequireApiKey(feature: keyof FeatureFlags): boolean {
  return feature === "aiEnhancement";
}

// For debugging purposes
if (import.meta.env.DEV) {
  console.log("🚩 Feature Flags:", featureFlags);
}

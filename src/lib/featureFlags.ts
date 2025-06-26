interface FeatureFlags {
  enableAIEnhancement: boolean;
  // Add more feature flags here as needed
}

// Configuration - Just change these values to enable/disable features
export const featureFlags: FeatureFlags = {
  enableAIEnhancement: true, // Set to true to enable AI Enhancement
};

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature];
}

// For debugging purposes
if (import.meta.env.DEV) {
  console.log("🚩 Feature Flags:", featureFlags);
}

import React from "react";
import ImageEnhancerUI from "./ImageEnhancerUI";
import { useImageEnhancer } from "../../hooks/useImageEnhancer";
import { isFeatureEnabled } from "../../lib/featureFlags";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const ImageEnhancer: React.FC = () => {
  const enhancerProps = useImageEnhancer();

  // Wrap the applyEnhancements function with feature flag check
  const wrappedApplyEnhancements = async () => {
    if (!isFeatureEnabled("enableAIEnhancement") && enhancerProps.useAI) {
      toast.error(
        "AI Image Enhancement is currently disabled. Please use basic image tools instead.",
        {
          duration: 4000,
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #7d3650",
          },
        }
      );
      return;
    }

    // Call the original applyEnhancements
    await enhancerProps.applyEnhancements();
  };

  // Modify the props to include our feature flag
  const modifiedProps = {
    ...enhancerProps,
    applyEnhancements: wrappedApplyEnhancements,
    // If AI is disabled, force useAI to false
    useAI: enhancerProps.useAI && isFeatureEnabled("enableAIEnhancement"),
    // Add a prop to show if the feature is enabled
    isAIFeatureEnabled: isFeatureEnabled("enableAIEnhancement"),
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "500",
          },
        }}
      />
      <ImageEnhancerUI {...modifiedProps} />
    </>
  );
};

export default ImageEnhancer;

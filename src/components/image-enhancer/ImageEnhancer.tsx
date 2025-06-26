import React, { useState } from "react";
import ImageEnhancerUI from "./ImageEnhancerUI";
import {
  enhanceImageWithAI,
  type AIEnhancementOptions,
} from "../../lib/aiEnhancement";
import toast from "react-hot-toast";

const ImageEnhancer: React.FC = () => {
  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [showSocialShare, setShowSocialShare] = useState(false);

  // AI Enhancement Handler
  const handleAIEnhance = async (file: File, options: AIEnhancementOptions) => {
    try {
      setIsProcessing(true);
      setEnhancedImageUrl(null);

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call AI enhancement
      const enhancedUrl = await enhanceImageWithAI(base64, options);
      setEnhancedImageUrl(enhancedUrl);

      toast.success("✨ Image enhanced successfully!", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      });
    } catch (error) {
      console.error("Enhancement failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Enhancement failed",
        {
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #7d3650",
          },
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // File Selection Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setEnhancedImageUrl(null);
      toast.success("🖼️ Image uploaded successfully!", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      });
    }
  };

  return (
    <ImageEnhancerUI
      // AI Enhancement props
      onEnhance={handleAIEnhance}
      isProcessing={isProcessing}
      // Basic Enhancement props
      images={[selectedFile].filter((f): f is File => f !== null)}
      previews={[]}
      enhancedUrls={[enhancedImageUrl].filter((u): u is string => u !== null)}
      selectedImages={[true]}
      currentProcessing={0}
      showSocialShare={showSocialShare}
      shareData={{
        imageCount: selectedFile ? 1 : 0,
      }}
      settings={{
        sharpness: 0,
        denoise: 0,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        upscaleFactor: 1,
      }}
      useAI={true}
      presets={[]}
      // Handlers
      setSettings={() => {}}
      setUseAI={() => {}}
      handleFileSelect={handleFileSelect}
      removeImage={() => {}}
      toggleImageSelection={() => {}}
      selectAllImages={() => {}}
      deselectAllImages={() => {}}
      getSelectedCount={() => (selectedFile ? 1 : 0)}
      applyEnhancements={() => {}}
      downloadEnhancedImages={() => {}}
      handleCloseSocialShare={() => setShowSocialShare(false)}
      handleOpenSocialShare={() => setShowSocialShare(true)}
      applyPreset={() => {}}
    />
  );
};

export default ImageEnhancer;

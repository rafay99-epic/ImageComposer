import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import toast from "react-hot-toast";
import {
  enhancementPresets,
  type EnhancementSettings,
} from "../lib/enhancementPresets";
import {
  processImageWithAI,
  type AIEnhancementOptions,
} from "../lib/aiEnhancement";

export const useImageEnhancer = () => {
  // State
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [enhancedUrls, setEnhancedUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<boolean[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState(0);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [shareData, setShareData] = useState<{
    imageCount: number;
    originalSize?: string;
    enhancedSize?: string;
  }>();
  const [isDragging, setIsDragging] = useState(false);
  const [settings, setSettings] = useState<EnhancementSettings>({
    sharpness: 50,
    denoise: 50,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    upscaleFactor: 1,
  });
  const [useAI, setUseAI] = useState(false);
  const [aiOptions, setAIOptions] = useState<AIEnhancementOptions>({
    upscale: false,
    faceEnhance: true,
    removeNoise: true,
    improveDetail: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drag & Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      await handleImageSelect(files);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
      ? Array.from(e.target.files).filter((file) =>
          file.type.startsWith("image/")
        )
      : [];
    if (files.length > 0) {
      await handleImageSelect(files);
    }
  };

  const handleImageSelect = async (files: File[]) => {
    setImages(files);
    setEnhancedUrls([]);

    const newPreviews: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      const preview = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPreviews.push(preview);
    }

    setPreviews(newPreviews);
    setSelectedImages(new Array(files.length).fill(true));

    toast.success(
      `🖼️ ${files.length} image${
        files.length > 1 ? "s" : ""
      } uploaded successfully!`,
      {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      }
    );
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    const newSelected = selectedImages.filter(
      (_, index) => index !== indexToRemove
    );
    const newEnhanced = enhancedUrls.filter(
      (_, index) => index !== indexToRemove
    );

    setImages(newImages);
    setPreviews(newPreviews);
    setSelectedImages(newSelected);
    setEnhancedUrls(newEnhanced);

    toast.success("🗑️ Image removed successfully!", {
      style: {
        background: "#0d0915",
        color: "#ede6f4",
        border: "1px solid #7d3650",
      },
    });
  };

  const toggleImageSelection = (index: number) => {
    const newSelected = [...selectedImages];
    newSelected[index] = !newSelected[index];
    setSelectedImages(newSelected);
  };

  const selectAllImages = () => {
    setSelectedImages(new Array(images.length).fill(true));
  };

  const deselectAllImages = () => {
    setSelectedImages(new Array(images.length).fill(false));
  };

  const getSelectedCount = () => selectedImages.filter(Boolean).length;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const applyConvolution = (
    imageData: ImageData,
    kernel: number[],
    intensity: number
  ) => {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const temp = new Uint8ClampedArray(pixels);
    const kernelSize = 3;
    const kernelHalf = Math.floor(kernelSize / 2);

    for (let y = kernelHalf; y < height - kernelHalf; y++) {
      for (let x = kernelHalf; x < width - kernelHalf; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -kernelHalf; ky <= kernelHalf; ky++) {
            for (let kx = -kernelHalf; kx <= kernelHalf; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx =
                (ky + kernelHalf) * kernelSize + (kx + kernelHalf);
              sum += temp[idx]! * kernel[kernelIdx]!;
            }
          }
          const idx = (y * width + x) * 4 + c;
          pixels[idx] = Math.min(
            255,
            Math.max(0, temp[idx]! + (sum - temp[idx]!) * intensity)
          );
        }
      }
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = enhancementPresets.find((p) => p.name === presetName);
    if (preset) {
      setSettings(preset.settings);
      toast.success(`🎨 Applied "${preset.name}" preset`, {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      });
    }
  };

  const applyEnhancements = async () => {
    const selectedCount = getSelectedCount();
    if (selectedCount === 0) {
      toast.error("❌ Please select at least one image to enhance", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
      return;
    }

    setIsProcessing(true);
    setCurrentProcessing(0);

    const loadingToast = toast.loading(
      `🔄 Processing ${selectedCount} selected image${
        selectedCount > 1 ? "s" : ""
      }...`,
      {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      }
    );

    try {
      const newEnhancedUrls: string[] = [...enhancedUrls];
      let totalOriginalSize = 0;
      let totalEnhancedSize = 0;
      let processedCount = 0;

      for (let i = 0; i < images.length; i++) {
        if (!selectedImages[i]) {
          newEnhancedUrls[i] = enhancedUrls[i] || "";
          continue;
        }

        processedCount++;
        setCurrentProcessing(processedCount);

        toast.loading(
          `🔄 Enhancing image ${processedCount} of ${selectedCount}...`,
          {
            style: {
              background: "#0d0915",
              color: "#ede6f4",
              border: "1px solid #c0a6d9",
            },
          }
        );

        let enhancedUrl: string;

        if (useAI) {
          try {
            // Try AI enhancement first
            enhancedUrl = await processImageWithAI(images[i]!, aiOptions);
          } catch (error) {
            // Fall back to standard enhancement if AI fails
            enhancedUrl = await standardEnhancement(images[i]!, previews[i]!);
          }
        } else {
          enhancedUrl = await standardEnhancement(images[i]!, previews[i]!);
        }

        newEnhancedUrls[i] = enhancedUrl;

        // Calculate sizes
        const originalBlob = await fetch(previews[i]!).then((r) => r.blob());
        const enhancedBlob = await fetch(enhancedUrl).then((r) => r.blob());
        totalOriginalSize += originalBlob.size;
        totalEnhancedSize += enhancedBlob.size;
      }

      setEnhancedUrls(newEnhancedUrls);
      setShareData({
        imageCount: selectedCount,
        originalSize: formatSize(totalOriginalSize),
        enhancedSize: formatSize(totalEnhancedSize),
      });

      toast.dismiss(loadingToast);
      toast.success("✨ Images enhanced successfully!", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      });
    } catch (error) {
      console.error("Error enhancing images:", error);
      toast.dismiss(loadingToast);
      toast.error(
        `❌ ${
          error instanceof Error ? error.message : "Failed to enhance images"
        }`,
        {
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #7d3650",
          },
        }
      );
    }

    setIsProcessing(false);
  };

  const standardEnhancement = async (
    file: File,
    preview: string
  ): Promise<string> => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      throw new Error("Failed to get canvas context");
    }

    const img = new Image();
    img.src = preview;

    return new Promise<string>((resolve, reject) => {
      img.onload = async () => {
        try {
          const maxDimension = 4096;
          const targetWidth = img.width * settings.upscaleFactor;
          const targetHeight = img.height * settings.upscaleFactor;

          if (targetWidth > maxDimension || targetHeight > maxDimension) {
            throw new Error(
              "Image dimensions too large after upscaling. Please use a smaller image or lower upscale factor."
            );
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          const tempCtx = tempCanvas.getContext("2d");

          if (!tempCtx) {
            throw new Error("Failed to create temporary canvas context");
          }

          tempCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

          if (settings.denoise > 50) {
            tempCtx.filter = `blur(${(settings.denoise - 50) / 20}px)`;
            tempCtx.drawImage(tempCanvas, 0, 0);
            tempCtx.filter = "none";
            ctx.drawImage(tempCanvas, 0, 0);
          }

          if (settings.sharpness > 50) {
            const imageData = tempCtx.getImageData(
              0,
              0,
              targetWidth,
              targetHeight
            );
            const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            applyConvolution(
              imageData,
              sharpenKernel,
              (settings.sharpness - 50) / 50
            );
            tempCtx.putImageData(imageData, 0, 0);
          }

          if (
            settings.brightness !== 100 ||
            settings.contrast !== 100 ||
            settings.saturation !== 100
          ) {
            ctx.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`;
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.filter = "none";
          } else {
            ctx.drawImage(tempCanvas, 0, 0);
          }

          resolve(canvas.toDataURL("image/jpeg", 0.95));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const downloadEnhancedImages = () => {
    const selectedCount = getSelectedCount();
    if (selectedCount === 0) return;

    images.forEach((file, index) => {
      if (!selectedImages[index] || !enhancedUrls[index]) return;

      const link = document.createElement("a");
      link.href = enhancedUrls[index]!;
      link.download = `enhanced_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    toast.success(
      `🎉 ${selectedCount} enhanced image${
        selectedCount > 1 ? "s" : ""
      } downloaded!`,
      {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      }
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseSocialShare = () => {
    setShowSocialShare(false);
  };

  const handleOpenSocialShare = () => {
    setShowSocialShare(true);
  };

  return {
    // State
    images,
    previews,
    enhancedUrls,
    selectedImages,
    isProcessing,
    currentProcessing,
    showSocialShare,
    shareData,
    isDragging,
    settings,
    useAI,
    aiOptions,
    fileInputRef,
    canvasRef,
    presets: enhancementPresets,

    // Setters
    setSettings,
    setUseAI,
    setAIOptions,

    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeImage,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    getSelectedCount,
    applyEnhancements,
    applyPreset,
    downloadEnhancedImages,
    triggerFileInput,
    handleCloseSocialShare,
    handleOpenSocialShare,
  };
};

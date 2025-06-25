import { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { compressImage, applyRoundedCorners } from "../utils/imageProcessing";
import toast from "react-hot-toast";

export const useImageComposer = () => {
  // State
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<boolean[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [roundedCorners, setRoundedCorners] = useState<boolean>(false);
  const [cornerRadius, setCornerRadius] = useState<number>(10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentProcessing, setCurrentProcessing] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // File Selection Handler
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

  // Image Selection Logic
  const handleImageSelect = async (files: File[]) => {
    setImages(files);

    // Generate previews for all images
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
    // Initialize all images as selected by default
    setSelectedImages(new Array(files.length).fill(true));

    // Show success toast
    toast.success(
      `🖼️ ${files.length} image${
        files.length > 1 ? "s" : ""
      } uploaded successfully!`,
      {
        duration: 3000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      }
    );
  };

  // Image Management Functions
  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    const newSelected = selectedImages.filter(
      (_, index) => index !== indexToRemove
    );

    setImages(newImages);
    setPreviews(newPreviews);
    setSelectedImages(newSelected);

    toast.success("🗑️ Image removed successfully!", {
      duration: 2000,
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

  // Main Compression Logic
  const handleCompression = async () => {
    const selectedCount = getSelectedCount();
    if (selectedCount === 0) {
      toast.error("❌ Please select at least one image to compress", {
        duration: 3000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
      return;
    }

    try {
      setProcessing(true);
      setCurrentProcessing(0);

      // Show processing toast
      toast.loading(
        `🔄 Processing ${selectedCount} selected image${
          selectedCount > 1 ? "s" : ""
        }...`,
        {
          duration: 0, // Will be dismissed manually
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #c0a6d9",
          },
        }
      );

      const processedImages: string[] = [];
      let processedCount = 0;

      // Process only selected images
      for (let i = 0; i < images.length; i++) {
        if (!selectedImages[i]) continue; // Skip unselected images

        processedCount++;
        setCurrentProcessing(processedCount);

        // Update toast to show current progress
        toast.dismiss();
        toast.loading(
          `🔄 Processing image ${processedCount} of ${selectedCount}...`,
          {
            duration: 0,
            style: {
              background: "#0d0915",
              color: "#ede6f4",
              border: "1px solid #c0a6d9",
            },
          }
        );

        const image = images[i]!;

        // Compress the image
        let processedImage = await compressImage(image, {
          quality: quality / 100,
          format,
          maxWidth: 2000,
          maxHeight: 2000,
        });

        // Apply rounded corners if needed
        if (roundedCorners && cornerRadius > 0) {
          processedImage = await applyRoundedCorners(
            processedImage,
            cornerRadius
          );
        }

        processedImages.push(processedImage);
      }

      // Download all processed images
      for (let i = 0; i < processedImages.length; i++) {
        const link = document.createElement("a");
        link.href = processedImages[i]!;
        link.download = `compressed_image_${i + 1}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Dismiss loading toast and show success toast
      toast.dismiss();
      toast.success(
        `🎉 ${selectedCount} image${
          selectedCount > 1 ? "s" : ""
        } converted and downloaded!`,
        {
          duration: 4000,
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #bd6567",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      // Dismiss loading toast and show error toast
      toast.dismiss();
      toast.error("❌ Failed to process images", {
        duration: 4000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
    } finally {
      setProcessing(false);
      setCurrentProcessing(0);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    // State
    images,
    previews,
    selectedImages,
    quality,
    format,
    roundedCorners,
    cornerRadius,
    isDragging,
    processing,
    currentProcessing,
    fileInputRef,

    // Setters
    setQuality,
    setFormat,
    setRoundedCorners,
    setCornerRadius,

    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleImageSelect,
    removeImage,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    getSelectedCount,
    handleCompression,
    triggerFileInput,
  };
};

import React, { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { compressImage, applyRoundedCorners } from "../utils/imageProcessing";
import {
  Upload,
  Settings,
  Download,
  Image,
  Zap,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ImageComposer: React.FC = () => {
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

  // Remove an image by index
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

  // Toggle selection of an image
  const toggleImageSelection = (index: number) => {
    const newSelected = [...selectedImages];
    newSelected[index] = !newSelected[index];
    setSelectedImages(newSelected);
  };

  // Select all images
  const selectAllImages = () => {
    setSelectedImages(new Array(images.length).fill(true));
  };

  // Deselect all images
  const deselectAllImages = () => {
    setSelectedImages(new Array(images.length).fill(false));
  };

  const getSelectedCount = () => selectedImages.filter(Boolean).length;

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
      <section
        id="composer"
        className="relative py-32 bg-background overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-36 h-36 bg-accent/10 rounded-full blur-2xl animate-float"></div>
          <div
            className="absolute bottom-10 right-20 w-28 h-28 bg-primary/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-20 h-20 bg-secondary/10 rounded-full blur-lg animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-text/80">
                Image Processing Studio
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-text via-accent to-primary bg-clip-text text-transparent">
              Transform Your Images
            </h2>
            <p className="text-xl text-text/70 leading-relaxed">
              Professional image compression and optimization with
              <span className="text-accent font-semibold">
                {" "}
                real-time preview
              </span>{" "}
              and advanced settings.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Main Processing Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

              <div className="relative glass rounded-3xl p-8 backdrop-blur-xl border border-primary/20">
                {/* Upload Area */}
                <div
                  className={`
                  relative aspect-[16/10] mb-8 rounded-2xl border-2 border-dashed
                  transition-all duration-300 cursor-pointer group/upload
                  flex items-center justify-center overflow-hidden
                  ${
                    isDragging
                      ? "border-accent bg-accent/10 scale-105"
                      : previews.length > 0
                      ? "border-primary/40 bg-background/5"
                      : "border-primary/30 hover:border-accent/60 hover:bg-primary/5"
                  }
                `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />

                  {previews.length > 0 ? (
                    <div className="relative w-full h-full group/preview">
                      {previews.length === 1 ? (
                        // Single image preview
                        <div className="relative w-full h-full group/single">
                          <img
                            src={previews[0]}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-xl"
                          />
                          {/* Single image controls */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/single:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleImageSelection(0);
                              }}
                              className={`p-2 rounded-lg backdrop-blur-sm border transition-all ${
                                selectedImages[0]
                                  ? "bg-primary border-primary text-white"
                                  : "bg-background/50 border-white text-text hover:bg-primary/20"
                              }`}
                              title={selectedImages[0] ? "Deselect" : "Select"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(0);
                              }}
                              className="p-2 bg-secondary/80 backdrop-blur-sm border border-secondary rounded-lg text-white hover:bg-secondary transition-all"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Multiple images grid
                        <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                          {previews.slice(0, 4).map((preview, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden rounded-lg group"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Selection checkbox */}
                              <div className="absolute top-2 left-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleImageSelection(index);
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selectedImages[index]
                                      ? "bg-primary border-primary"
                                      : "bg-background/50 border-white backdrop-blur-sm"
                                  }`}
                                >
                                  {selectedImages[index] && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </button>
                              </div>
                              {/* Remove button */}
                              <div className="absolute top-2 right-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  className="w-6 h-6 bg-secondary/80 backdrop-blur-sm border border-secondary rounded-full flex items-center justify-center text-white hover:bg-secondary transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              {index === 3 && previews.length > 4 && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                  <span className="text-text font-semibold">
                                    +{previews.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium text-text">
                            Click to change images
                          </p>
                          <p className="text-xs text-text/60 mt-1">
                            {images.length} image{images.length > 1 ? "s" : ""}{" "}
                            selected
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="floating-element mb-6">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full border border-primary/30">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-text mb-2 group-hover/upload:text-primary transition-colors">
                        Drop Your Images Here
                      </h3>
                      <p className="text-text/60 mb-4">
                        or click to browse multiple files
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Image className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          JPEG, PNG, WebP supported
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Management Section - Only show when there are multiple images */}
                {images.length > 1 && (
                  <div className="mb-8">
                    <div className="glass rounded-2xl p-6 border border-primary/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                          <Image className="w-5 h-5 text-primary" />
                          Image Management ({getSelectedCount()}/{images.length}{" "}
                          selected)
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={selectAllImages}
                            className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            onClick={deselectAllImages}
                            className="px-3 py-1 text-xs bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>

                      {/* Image List */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group glass rounded-lg overflow-hidden border border-primary/10"
                          >
                            <img
                              src={previews[index]}
                              alt={`Image ${index + 1}`}
                              className="w-full h-20 object-cover"
                            />

                            {/* Overlay with controls */}
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1">
                              <button
                                onClick={() => toggleImageSelection(index)}
                                className={`p-1.5 rounded-lg transition-all ${
                                  selectedImages[index]
                                    ? "bg-primary text-white"
                                    : "bg-background/50 text-text hover:bg-primary/20"
                                }`}
                                title={
                                  selectedImages[index] ? "Deselect" : "Select"
                                }
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeImage(index)}
                                className="p-1.5 bg-secondary/80 text-white rounded-lg hover:bg-secondary transition-all"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Selection indicator */}
                            <div className="absolute top-1 left-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedImages[index]
                                    ? "bg-primary border-primary"
                                    : "bg-background/50 border-white backdrop-blur-sm"
                                }`}
                              >
                                {selectedImages[index] && (
                                  <Check className="w-2 h-2 text-white" />
                                )}
                              </div>
                            </div>

                            {/* Image name */}
                            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
                              <p className="text-xs text-text/80 truncate">
                                {image.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Compression Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-text">
                        Compression Settings
                      </h3>
                    </div>

                    {/* Quality Slider */}
                    <div className="glass rounded-xl p-6 border border-primary/20">
                      <label className="block text-sm font-medium text-text mb-3">
                        Quality ({quality}%)
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(parseInt(e.target.value))}
                          className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #c0a6d9 0%, #c0a6d9 ${quality}%, rgba(192,166,217,0.2) ${quality}%, rgba(192,166,217,0.2) 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-xs text-text/50 mt-1">
                          <span>1%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Format Selection */}
                    <div className="glass rounded-xl p-6 border border-secondary/20">
                      <label className="block text-sm font-medium text-text mb-3">
                        Output Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["jpeg", "png", "webp"] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              format === fmt
                                ? "bg-secondary text-text shadow-lg"
                                : "bg-background/20 text-text/70 hover:bg-secondary/20 hover:text-text"
                            }`}
                          >
                            {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Enhancement Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold text-text">
                        Enhancement Options
                      </h3>
                    </div>

                    {/* Rounded Corners */}
                    <div className="glass rounded-xl p-6 border border-accent/20">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-text">
                            Rounded Corners
                          </span>
                          <p className="text-xs text-text/60 mt-1">
                            Add rounded corners to your image
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={roundedCorners}
                            onChange={(e) =>
                              setRoundedCorners(e.target.checked)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                              roundedCorners ? "bg-accent" : "bg-background/50"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                roundedCorners
                                  ? "translate-x-6"
                                  : "translate-x-0.5"
                              }`}
                              style={{ marginTop: "2px" }}
                            ></div>
                          </div>
                        </div>
                      </label>

                      {roundedCorners && (
                        <div className="mt-4 pt-4 border-t border-accent/20">
                          <label className="block text-sm font-medium text-text mb-3">
                            Corner Radius ({cornerRadius}px)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cornerRadius}
                            onChange={(e) =>
                              setCornerRadius(parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #bd6567 0%, #bd6567 ${cornerRadius}%, rgba(189,101,103,0.2) ${cornerRadius}%, rgba(189,101,103,0.2) 100%)`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Info Card */}
                    <div className="glass rounded-xl p-6 border border-text/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text mb-1">
                            Processing Info
                          </h4>
                          <p className="text-xs text-text/60 leading-relaxed">
                            All processing happens in your browser. Your images
                            never leave your device.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Button */}
                <div className="relative">
                  <button
                    onClick={handleCompression}
                    disabled={
                      images.length === 0 ||
                      processing ||
                      getSelectedCount() === 0
                    }
                    className="w-full py-4 px-8 bg-primary text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                        Processing {getSelectedCount()} image
                        {getSelectedCount() > 1 ? "s" : ""}...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                        Compress & Download{" "}
                        {images.length > 1
                          ? `(${getSelectedCount()} selected)`
                          : ""}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImageComposer;

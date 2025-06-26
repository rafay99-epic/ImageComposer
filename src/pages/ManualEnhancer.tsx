import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  FileImage,
  Info,
  Check,
  X,
  Download,
  Sparkles,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  enhanceMultipleImages,
  defaultSettings,
  type ManualEnhancementSettings,
} from "../lib/manualEnhancement";
import { enhancementPresets } from "../lib/enhancementPresets";

const ManualEnhancer: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [enhancedUrls, setEnhancedUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<boolean[]>([]);
  const [currentProcessing, setCurrentProcessing] = useState(0);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [settings, setSettings] =
    useState<ManualEnhancementSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files];
      setImages(newImages);

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);

      // Initialize selection states
      setSelectedImages([...selectedImages, ...files.map(() => true)]);
      setEnhancedUrls([...enhancedUrls, ...files.map(() => "")]);

      toast.success("🖼️ Images uploaded successfully!", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #c0a6d9",
        },
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setEnhancedUrls(enhancedUrls.filter((_, i) => i !== index));
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) =>
      prev.map((sel, i) => (i === index ? !sel : sel))
    );
  };

  const selectAllImages = () => {
    setSelectedImages(images.map(() => true));
  };

  const deselectAllImages = () => {
    setSelectedImages(images.map(() => false));
  };

  const getSelectedCount = () => {
    return selectedImages.filter(Boolean).length;
  };

  const applyEnhancements = async () => {
    if (getSelectedCount() === 0) {
      toast.error("Please select at least one image", {
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

    try {
      const imagesToProcess = previews.map((url, index) => ({
        url,
        selected: selectedImages[index] ?? false,
      }));

      const enhanced = await enhanceMultipleImages(
        imagesToProcess,
        settings,
        (current, total) => setCurrentProcessing(current)
      );

      setEnhancedUrls(enhanced);

      toast.success(`✨ Enhanced ${getSelectedCount()} images!`, {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      });
    } catch (error) {
      toast.error("Failed to enhance images", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadEnhancedImages = () => {
    enhancedUrls.forEach((url, index) => {
      if (url && selectedImages[index]) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `enhanced-${images[index]?.name || "image"}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });

    toast.success("🎉 Images downloaded successfully!", {
      style: {
        background: "#0d0915",
        color: "#ede6f4",
        border: "1px solid #bd6567",
      },
    });
  };

  const applyPreset = (presetName: string) => {
    const preset = enhancementPresets.find((p) => p.name === presetName);
    if (!preset?.settings) return;

    setSettings(preset.settings as ManualEnhancementSettings);
    toast.success(`Applied ${preset.name} preset!`, {
      style: {
        background: "#0d0915",
        color: "#ede6f4",
        border: "1px solid #c0a6d9",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
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

      {/* Hero Section with Background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-float"></div>
          <div
            className="absolute bottom-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className={`inline-flex items-center gap-2 ${
                isMobile ? "px-3 py-1.5" : "px-4 py-2"
              } rounded-full glass border border-primary/30 mb-8`}
            >
              <FileImage
                className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} text-primary`}
              />
              <span
                className={`${
                  isMobile ? "text-xs" : "text-sm"
                } font-medium text-text/80`}
              >
                Manual Image Enhancement
              </span>
            </div>

            <h1
              className={`${
                isMobile ? "text-3xl sm:text-4xl" : "text-5xl"
              } font-bold tracking-tight text-text sm:text-6xl bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent`}
            >
              Professional Image Enhancement
            </h1>
            <p className="mt-6 text-lg leading-8 text-text/70">
              Transform your images with professional-grade manual adjustments
              and presets
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="glass rounded-3xl p-8 border border-primary/20 backdrop-blur-xl">
          {/* File Upload Section */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>

              <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 transition-all hover:bg-primary/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-16 h-16 text-primary mb-4 floating-element" />
                  <span className="text-xl font-medium text-text mb-2">
                    {images.length > 0
                      ? `${images.length} image${
                          images.length > 1 ? "s" : ""
                        } selected`
                      : "Choose images"}
                  </span>
                  <span className="text-sm text-text/60">
                    Drop your images here, or click to browse
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Enhancement Controls */}
          {images.length > 0 && (
            <div className="space-y-6">
              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border ${
                      selectedImages[index]
                        ? "border-primary/40"
                        : "border-primary/20"
                    }`}
                  >
                    <img
                      src={previews[index]}
                      alt={image.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                        <button
                          onClick={() => toggleImageSelection(index)}
                          className={`p-2 rounded-lg ${
                            selectedImages[index]
                              ? "bg-primary/20 text-primary"
                              : "bg-background/50 text-text/60"
                          }`}
                        >
                          {selectedImages[index] ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="p-2 rounded-lg bg-background/50 text-text/60 hover:text-text"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhancement Settings */}
              <div className="p-6 bg-background/30 rounded-xl border border-primary/20">
                <h3 className="text-lg font-medium text-text mb-6 flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Enhancement Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Quality */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text/80">
                      Image Quality
                    </h4>
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Sharpness
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.sharpness}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={settings.sharpness}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              sharpness: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Noise Reduction
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.denoise}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={settings.denoise}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              denoise: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Upscale Factor
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.upscaleFactor}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          step="0.5"
                          value={settings.upscaleFactor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              upscaleFactor: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color Adjustments */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text/80">
                      Color Adjustments
                    </h4>
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Brightness
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.brightness}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={settings.brightness}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              brightness: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Contrast
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.contrast}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={settings.contrast}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              contrast: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="relative">
                        <div className="flex justify-between mb-2">
                          <label className="text-sm text-text/70">
                            Saturation
                          </label>
                          <span className="text-sm text-primary font-medium">
                            {settings.saturation}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={settings.saturation}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              saturation: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings(defaultSettings)}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Presets */}
              <div className="p-6 bg-background/30 rounded-xl border border-primary/20">
                <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Enhancement Presets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enhancementPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.name)}
                      className="group p-4 glass rounded-xl border border-primary/20 hover:border-primary/40 transition-all text-left hover:bg-primary/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-xl">
                          {preset.icon}
                        </div>
                        <div>
                          <span className="text-base font-medium text-text block group-hover:text-primary transition-colors">
                            {preset.name}
                          </span>
                          <span className="text-sm text-text/60 block mt-1">
                            {preset.description}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={selectAllImages}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Select All
                </Button>
                <Button
                  onClick={deselectAllImages}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Deselect All
                </Button>
                <Button
                  onClick={applyEnhancements}
                  disabled={isProcessing || getSelectedCount() === 0}
                  className="flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  {isProcessing
                    ? `Enhancing ${currentProcessing}/${getSelectedCount()}`
                    : "Enhance Images"}
                </Button>
                {enhancedUrls.some((url) => url) && (
                  <Button
                    onClick={downloadEnhancedImages}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Enhanced
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualEnhancer;

import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Upload,
  Zap,
  Share2,
  X,
  Check,
  Sliders,
  Info,
  FileImage,
} from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "../../hooks/useIsMobile";
import SocialShare from "../SocialShare";
import type { AIEnhancementOptions } from "../../lib/aiEnhancement";
import type { Preset } from "../../lib/enhancementPresets";
import toast, { Toaster } from "react-hot-toast";

interface ImageEnhancerUIProps {
  // AI Enhancement
  onEnhance: (file: File, options: AIEnhancementOptions) => Promise<void>;
  isProcessing: boolean;

  // Basic Enhancement
  images: File[];
  previews: string[];
  enhancedUrls: string[];
  selectedImages: boolean[];
  currentProcessing: number;
  showSocialShare: boolean;
  shareData?: {
    imageCount: number;
    originalSize?: string;
    enhancedSize?: string;
  };
  settings: {
    sharpness: number;
    denoise: number;
    brightness: number;
    contrast: number;
    saturation: number;
    upscaleFactor: number;
  };
  useAI: boolean;
  presets: Preset[];
  isAIFeatureEnabled?: boolean;

  // Handlers
  setSettings: (settings: any) => void;
  setUseAI: (useAI: boolean) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  toggleImageSelection: (index: number) => void;
  selectAllImages: () => void;
  deselectAllImages: () => void;
  getSelectedCount: () => number;
  applyEnhancements: () => void;
  downloadEnhancedImages: () => void;
  handleCloseSocialShare: () => void;
  handleOpenSocialShare: () => void;
  applyPreset: (presetName: string) => void;
}

const ImageEnhancerUI: React.FC<ImageEnhancerUIProps> = ({
  // AI Enhancement props
  onEnhance,
  isProcessing,
  // Basic Enhancement props
  images,
  previews,
  enhancedUrls,
  selectedImages,
  currentProcessing,
  showSocialShare,
  shareData,
  settings,
  useAI,
  presets,
  isAIFeatureEnabled = true,
  // Handlers
  setSettings,
  setUseAI,
  handleFileSelect: parentHandleFileSelect,
  removeImage,
  toggleImageSelection,
  selectAllImages,
  deselectAllImages,
  getSelectedCount,
  applyEnhancements,
  downloadEnhancedImages,
  handleCloseSocialShare,
  handleOpenSocialShare,
  applyPreset,
}) => {
  const { isMobile } = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiOptions, setAIOptions] = useState<AIEnhancementOptions>({
    upscale: true,
    faceEnhance: false,
    removeNoise: false,
    improveDetail: true,
    prompt: "",
    negativePrompt: "",
  });

  const handleLocalFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Load image to get dimensions for AI mode
        if (useAI) {
          const img = document.createElement("img");
          img.onload = () => {
            const isLargeImage = img.width >= 512 && img.height >= 512;
            toast.success(
              `🖼️ ${isLargeImage ? "Large" : "Small"} image detected (${
                img.width
              }x${img.height}px). Will use ${
                isLargeImage ? "ControlNet Tile" : "Real-ESRGAN"
              } model.`,
              {
                duration: 5000,
                style: {
                  background: "#0d0915",
                  color: "#ede6f4",
                  border: "1px solid #c0a6d9",
                },
              }
            );
          };
          img.src = url;
        }

        // Call parent handler for basic mode
        parentHandleFileSelect(event);
      } else {
        toast.error("❌ Please select a valid image file", {
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #7d3650",
          },
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (useAI) {
      if (!selectedFile) {
        toast.error("Please select an image first");
        return;
      }
      await onEnhance(selectedFile, aiOptions);
    } else {
      applyEnhancements();
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className={`inline-flex items-center gap-2 ${
                isMobile ? "px-3 py-1.5" : "px-4 py-2"
              } rounded-full glass border border-primary/30 mb-8`}
            >
              <Sparkles
                className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} text-primary`}
              />
              <span
                className={`${
                  isMobile ? "text-xs" : "text-sm"
                } font-medium text-text/80`}
              >
                AI-Powered Enhancement
              </span>
            </div>

            <h1
              className={`${
                isMobile ? "text-3xl sm:text-4xl" : "text-5xl"
              } font-bold tracking-tight text-text sm:text-6xl bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent`}
            >
              Image Enhancement
            </h1>
            <p className="mt-6 text-lg leading-8 text-text/70">
              Transform your images with AI-powered enhancement or professional
              manual adjustments.
            </p>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
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

        {showSocialShare && (
          <SocialShare
            isOpen={showSocialShare}
            onClose={handleCloseSocialShare}
            shareData={shareData}
          />
        )}

        {/* Enhancement Mode Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text">Enhancement Mode</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI && isAIFeatureEnabled}
                onChange={(e) => setUseAI(e.target.checked)}
                disabled={!isAIFeatureEnabled}
                className="rounded border-primary/20"
              />
              <label
                htmlFor="useAI"
                className={`text-sm ${
                  !isAIFeatureEnabled ? "text-text/50" : "text-text/70"
                }`}
              >
                Use AI Enhancement
              </label>
              {!isAIFeatureEnabled && (
                <span className="text-xs text-accent">
                  (Currently Disabled)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 transition-all hover:bg-primary/10">
              <input
                type="file"
                accept="image/*"
                onChange={handleLocalFileSelect}
                className="hidden"
                id="image-upload"
                multiple={!useAI}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-16 h-16 text-primary mb-4 floating-element" />
                <span className="text-xl font-medium text-text mb-2">
                  {useAI
                    ? selectedFile
                      ? selectedFile.name
                      : "Choose an image"
                    : images.length > 0
                    ? `${images.length} image${
                        images.length > 1 ? "s" : ""
                      } selected`
                    : "Choose images"}
                </span>
                <span className="text-sm text-text/60">
                  Drop your image{!useAI && "s"} here, or click to browse
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Grid (Basic Mode) */}
        {!useAI && images.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((file, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden border ${
                  selectedImages[index]
                    ? "border-primary/40"
                    : "border-primary/20"
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {enhancedUrls[index] && (
                    <img
                      src={enhancedUrls[index]}
                      alt="Enhanced"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => toggleImageSelection(index)}
                    className={`p-1.5 rounded-lg ${
                      selectedImages[index]
                        ? "bg-primary/20 text-primary"
                        : "bg-background/50 text-text/60"
                    }`}
                  >
                    {selectedImages[index] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="p-1.5 rounded-lg bg-background/50 text-text/60 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview (AI Mode) */}
        {useAI && previewUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Preview
            </h3>
            <div className="rounded-xl overflow-hidden border border-primary/20">
              <img src={previewUrl} alt="Preview" className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* AI Enhancement Options */}
        {useAI && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              AI Enhancement Options
            </h3>
            <div className="space-y-4 p-6 bg-background/30 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="upscale"
                  checked={aiOptions.upscale}
                  onChange={(e) =>
                    setAIOptions({ ...aiOptions, upscale: e.target.checked })
                  }
                  className="rounded border-primary/20"
                />
                <label htmlFor="upscale" className="text-text/80">
                  Upscale Image
                </label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-text/40" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background/90 text-xs rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Increase image resolution
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="faceEnhance"
                  checked={aiOptions.faceEnhance}
                  onChange={(e) =>
                    setAIOptions({
                      ...aiOptions,
                      faceEnhance: e.target.checked,
                    })
                  }
                  className="rounded border-primary/20"
                />
                <label htmlFor="faceEnhance" className="text-text/80">
                  Enhance Faces
                </label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-text/40" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background/90 text-xs rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Improve facial features
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="removeNoise"
                  checked={aiOptions.removeNoise}
                  onChange={(e) =>
                    setAIOptions({
                      ...aiOptions,
                      removeNoise: e.target.checked,
                    })
                  }
                  className="rounded border-primary/20"
                />
                <label htmlFor="removeNoise" className="text-text/80">
                  Remove Noise
                </label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-text/40" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background/90 text-xs rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Clean up image artifacts and noise
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="improveDetail"
                  checked={aiOptions.improveDetail}
                  onChange={(e) =>
                    setAIOptions({
                      ...aiOptions,
                      improveDetail: e.target.checked,
                    })
                  }
                  className="rounded border-primary/20"
                />
                <label htmlFor="improveDetail" className="text-text/80">
                  Improve Details
                </label>
                <div className="relative group">
                  <Info className="w-4 h-4 text-text/40" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background/90 text-xs rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Enhance image details and sharpness
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm text-text/70">
                  Enhancement Prompt (for larger images)
                </label>
                <input
                  type="text"
                  id="prompt"
                  value={aiOptions.prompt || ""}
                  onChange={(e) =>
                    setAIOptions({ ...aiOptions, prompt: e.target.value })
                  }
                  placeholder="E.g., enhance details, improve lighting, make more vibrant"
                  className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg text-text focus:outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="negativePrompt"
                  className="text-sm text-text/70"
                >
                  Negative Prompt (what to avoid)
                </label>
                <input
                  type="text"
                  id="negativePrompt"
                  value={aiOptions.negativePrompt || ""}
                  onChange={(e) =>
                    setAIOptions({
                      ...aiOptions,
                      negativePrompt: e.target.value,
                    })
                  }
                  placeholder="E.g., blur, noise, artifacts, distortion"
                  className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg text-text focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* Basic Enhancement Options */}
        {!useAI && (
          <>
            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.name)}
                  className="p-3 glass rounded-xl border border-primary/20 text-text/80 hover:border-primary/40 transition-all duration-300 flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">{preset.icon}</span>
                  <span className="font-medium text-sm">{preset.name}</span>
                  <span className="text-xs text-text/60 text-center">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Manual Adjustments */}
            <div className="mb-8 p-6 bg-background/30 rounded-xl border border-primary/20">
              <h3 className="text-lg font-medium text-text mb-4">
                Manual Adjustments
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Sharpness Enhancement
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sharpness}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        sharpness: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Noise Reduction
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.denoise}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        denoise: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Brightness
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.brightness}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        brightness: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Contrast
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.contrast}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        contrast: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Saturation
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.saturation}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        saturation: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-text/70 mb-2 block">
                    Upscale Factor
                  </label>
                  <select
                    value={settings.upscaleFactor}
                    onChange={(e) =>
                      setSettings((prev: any) => ({
                        ...prev,
                        upscaleFactor: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg text-text focus:outline-none focus:border-primary/40"
                  >
                    <option value="1">1x (Original)</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                    <option value="4">4x</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!useAI && images.length > 0 && (
            <>
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
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={
              isProcessing ||
              (!useAI && images.length === 0) ||
              (useAI && !selectedFile)
            }
            className="flex items-center gap-2 px-6 py-2 text-lg"
          >
            {isProcessing ? (
              <>
                <Zap className="w-5 h-5" />
                {useAI
                  ? "Enhancing..."
                  : `Enhancing ${currentProcessing} of ${getSelectedCount()}...`}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Enhance {useAI ? "Image" : "Images"}
              </>
            )}
          </Button>

          {!useAI && enhancedUrls.some(Boolean) && (
            <>
              <Button
                onClick={downloadEnhancedImages}
                variant="outline"
                className="flex items-center gap-2 px-6 py-2 text-lg"
              >
                <Download className="w-5 h-5" />
                Download All
              </Button>
              <Button
                onClick={handleOpenSocialShare}
                variant="outline"
                className="flex items-center gap-2 px-6 py-2 text-lg"
              >
                <Share2 className="w-5 h-5" />
                Share Results
              </Button>
            </>
          )}
        </div>

        {/* Enhanced Image Result (AI Mode) */}
        {useAI && previewUrl && (
          <div className="mt-8 p-8 glass rounded-3xl border border-primary/20 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
              Enhanced Result
            </h3>
            <div className="rounded-xl overflow-hidden border border-primary/20">
              <img src={previewUrl} alt="Enhanced" className="w-full h-auto" />
            </div>
            <div className="mt-4 text-center">
              <a
                href={previewUrl}
                download="enhanced-image.png"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary/20 text-text hover:border-primary/40 transition-all"
              >
                Download Enhanced Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEnhancerUI;

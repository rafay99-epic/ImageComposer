import React from "react";
import {
  Sparkles,
  Download,
  Upload,
  Zap,
  Share2,
  X,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "../../hooks/useIsMobile";
import SocialShare from "../SocialShare";
import type { AIEnhancementOptions } from "../../lib/aiEnhancement";
import type { Preset } from "../../lib/enhancementPresets";

interface ImageEnhancerUIProps {
  // State
  images: File[];
  previews: string[];
  enhancedUrls: string[];
  selectedImages: boolean[];
  isProcessing: boolean;
  currentProcessing: number;
  showSocialShare: boolean;
  shareData?: {
    imageCount: number;
    originalSize?: string;
    enhancedSize?: string;
  };
  isDragging: boolean;
  settings: {
    sharpness: number;
    denoise: number;
    brightness: number;
    contrast: number;
    saturation: number;
    upscaleFactor: number;
  };
  fileInputRef: React.RefObject<HTMLInputElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  useAI: boolean;
  aiOptions: AIEnhancementOptions;
  presets: Preset[];
  isAIFeatureEnabled?: boolean;

  // Setters
  setSettings: (settings: any) => void;
  setUseAI: (useAI: boolean) => void;
  setAIOptions: (
    options:
      | AIEnhancementOptions
      | ((prev: AIEnhancementOptions) => AIEnhancementOptions)
  ) => void;

  // Handlers
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  toggleImageSelection: (index: number) => void;
  selectAllImages: () => void;
  deselectAllImages: () => void;
  getSelectedCount: () => number;
  applyEnhancements: () => void;
  downloadEnhancedImages: () => void;
  triggerFileInput: () => void;
  handleCloseSocialShare: () => void;
  handleOpenSocialShare: () => void;
  applyPreset: (presetName: string) => void;
}

const ImageEnhancerUI: React.FC<ImageEnhancerUIProps> = ({
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
  fileInputRef,
  canvasRef,
  useAI,
  aiOptions,
  presets,
  setSettings,
  setUseAI,
  setAIOptions,
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
  downloadEnhancedImages,
  triggerFileInput,
  handleCloseSocialShare,
  handleOpenSocialShare,
  applyPreset,
  isAIFeatureEnabled = true,
}) => {
  const { isMobile } = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {showSocialShare && (
        <SocialShare
          isOpen={showSocialShare}
          onClose={handleCloseSocialShare}
          shareData={shareData}
        />
      )}

      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className={`inline-flex items-center gap-2 ${
                isMobile ? "px-3 py-1.5" : "px-4 py-2"
              } rounded-full glass border ${isMobile ? "mb-6" : "mb-8"}`}
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
              Image Quality Enhancer
            </h1>
            <p className="mt-6 text-lg leading-8 text-text/70">
              Transform your blurry or low-quality images into crystal-clear,
              professional-grade photos.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="glass rounded-3xl p-8 border border-primary/20 backdrop-blur-xl">
          {/* File Upload Section */}
          <div
            className={`mb-8 relative ${isDragging ? "bg-primary/10" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-primary/5 transition-all hover:bg-primary/10">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
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

          {/* Image Grid */}
          {images.length > 0 && (
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

          {/* Enhancement Mode */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text">
                Enhancement Mode
              </h3>
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

            {useAI && (
              <div className="p-4 bg-background/30 rounded-xl border border-primary/20 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text/70">Upscale (2x)</span>
                    <input
                      type="checkbox"
                      checked={aiOptions.upscale}
                      onChange={(e) =>
                        setAIOptions((prev) => ({
                          ...prev,
                          upscale: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text/70">
                      Face Enhancement
                    </span>
                    <input
                      type="checkbox"
                      checked={aiOptions.faceEnhance}
                      onChange={(e) =>
                        setAIOptions((prev) => ({
                          ...prev,
                          faceEnhance: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text/70">
                      Noise Reduction
                    </span>
                    <input
                      type="checkbox"
                      checked={aiOptions.removeNoise}
                      onChange={(e) =>
                        setAIOptions((prev) => ({
                          ...prev,
                          removeNoise: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text/70">
                      Detail Enhancement
                    </span>
                    <input
                      type="checkbox"
                      checked={aiOptions.improveDetail}
                      onChange={(e) =>
                        setAIOptions((prev) => ({
                          ...prev,
                          improveDetail: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {!useAI && (
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
            )}
          </div>

          {/* Enhancement Settings */}
          {!useAI && (
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
          )}

          {/* Add a notice when AI feature is disabled */}
          {!isAIFeatureEnabled && useAI && (
            <div className="mb-6 p-4 bg-accent/20 border border-accent/30 rounded-xl">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">
                  AI Enhancement is currently disabled
                </span>
              </div>
              <p className="mt-2 text-sm text-text/70">
                The AI enhancement feature is temporarily disabled. You can
                still use the basic image enhancement tools.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            {images.length > 0 && (
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
              onClick={images.length > 0 ? applyEnhancements : triggerFileInput}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2 text-lg"
            >
              {images.length > 0 ? (
                <>
                  <Zap className="w-5 h-5" />
                  {isProcessing
                    ? `Enhancing ${currentProcessing} of ${getSelectedCount()}...`
                    : "Enhance Images"}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Images
                </>
              )}
            </Button>

            {enhancedUrls.some(Boolean) && (
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

          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancerUI;

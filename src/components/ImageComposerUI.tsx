import React from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Upload,
  Settings,
  Download,
  Image,
  Zap,
  Sparkles,
  X,
  Check,
  Share2,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import SocialShare from "./SocialShare";

interface ImageComposerUIProps {
  // State
  images: File[];
  previews: string[];
  selectedImages: boolean[];
  quality: number;
  format: "jpeg" | "png" | "webp";
  roundedCorners: boolean;
  cornerRadius: number;
  isDragging: boolean;
  processing: boolean;
  showSocialShare: boolean;
  shareData?: {
    imageCount: number;
    compressionRatio?: number;
    originalSize?: string;
    compressedSize?: string;
  };
  fileInputRef: React.RefObject<HTMLInputElement>;

  // Setters
  setQuality: (quality: number) => void;
  setFormat: (format: "jpeg" | "png" | "webp") => void;
  setRoundedCorners: (value: boolean) => void;
  setCornerRadius: (radius: number) => void;

  // Handlers
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  toggleImageSelection: (index: number) => void;
  selectAllImages: () => void;
  deselectAllImages: () => void;
  getSelectedCount: () => number;
  handleCompression: () => void;
  triggerFileInput: () => void;
  handleCloseSocialShare: () => void;
  handleOpenSocialShare: () => void;
}

const ImageComposerUI: React.FC<ImageComposerUIProps> = ({
  images,
  previews,
  selectedImages,
  quality,
  format,
  roundedCorners,
  cornerRadius,
  isDragging,
  processing,
  showSocialShare,
  shareData,
  fileInputRef,
  setQuality,
  setFormat,
  setRoundedCorners,
  setCornerRadius,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  removeImage,
  toggleImageSelection,
  selectAllImages,
  deselectAllImages,
  getSelectedCount,
  handleCompression,
  triggerFileInput,
  handleCloseSocialShare,
  handleOpenSocialShare,
}) => {
  const { isMobile, isTablet, isTouchDevice } = useIsMobile();

  return (
    <section
      id="composer"
      className={`relative ${
        isMobile ? "py-16" : "py-32"
      } bg-background overflow-hidden`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs - reduced size on mobile */}
        <div
          className={`absolute ${
            isMobile ? "top-10 left-5 w-20 h-20" : "top-20 left-10 w-36 h-36"
          } bg-accent/10 rounded-full blur-2xl animate-float`}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "bottom-5 right-10 w-16 h-16"
              : "bottom-10 right-20 w-28 h-28"
          } bg-primary/10 rounded-full blur-xl animate-float`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "top-1/3 right-1/4 w-12 h-12"
              : "top-1/2 right-1/4 w-20 h-20"
          } bg-secondary/10 rounded-full blur-lg animate-float`}
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Grid pattern */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.03)_1px,transparent_1px)] ${
            isMobile ? "bg-[size:20px_20px]" : "bg-[size:40px_40px]"
          }`}
        ></div>
      </div>

      <div
        className={`${isMobile ? "px-4" : "container-custom"} relative z-10`}
      >
        {/* Header */}
        <div
          className={`text-center ${
            isMobile ? "max-w-full" : "max-w-3xl"
          } mx-auto ${isMobile ? "mb-8" : "mb-16"}`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 ${
              isMobile ? "px-3 py-1.5" : "px-4 py-2"
            } rounded-full glass border border-accent/30 mb-6`}
          >
            <Sparkles
              className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} text-accent`}
            />
            <span
              className={`${
                isMobile ? "text-xs" : "text-sm"
              } font-medium text-text/80`}
            >
              Image Processing Studio
            </span>
          </div>

          <h2
            className={`${
              isMobile ? "text-2xl sm:text-3xl" : "text-4xl lg:text-5xl"
            } font-bold mb-6 bg-gradient-to-r from-text via-accent to-primary bg-clip-text text-transparent`}
          >
            Transform Your Images
          </h2>
          <p
            className={`${
              isMobile ? "text-base" : "text-xl"
            } text-text/70 leading-relaxed ${isMobile ? "px-2" : ""}`}
          >
            Professional image compression and optimization with
            <span className="text-accent font-semibold">
              {" "}
              real-time preview
            </span>{" "}
            and advanced settings.
          </p>
        </div>

        <div className={`${isMobile ? "max-w-full" : "max-w-5xl"} mx-auto`}>
          {/* Main Processing Card */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div
              className={`relative glass rounded-3xl ${
                isMobile ? "p-4 sm:p-6" : "p-8"
              } backdrop-blur-xl border border-primary/20`}
            >
              {/* Upload Area */}
              <div
                className={`
                  relative ${
                    isMobile
                      ? "aspect-[4/3] sm:aspect-[16/10]"
                      : "aspect-[16/10]"
                  } ${
                  isMobile ? "mb-4" : "mb-8"
                } rounded-2xl border-2 border-dashed
                  transition-all duration-300 cursor-pointer group/upload
                  flex items-center justify-center overflow-hidden
                  ${isTouchDevice ? "touch-manipulation" : ""}
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
                onClick={triggerFileInput}
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
                        {/* Single image controls - optimized for mobile */}
                        <div
                          className={`absolute ${
                            isMobile ? "top-2 right-2" : "top-4 right-4"
                          } flex gap-2 ${
                            isMobile
                              ? "opacity-100"
                              : "opacity-0 group-hover/single:opacity-100"
                          } transition-opacity`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleImageSelection(0);
                            }}
                            className={`${
                              isMobile ? "p-3" : "p-2"
                            } rounded-lg backdrop-blur-sm border transition-all ${
                              selectedImages[0]
                                ? "bg-primary border-primary text-white"
                                : "bg-background/50 border-white text-text hover:bg-primary/20"
                            }`}
                            title={selectedImages[0] ? "Deselect" : "Select"}
                          >
                            <Check
                              className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(0);
                            }}
                            className={`${
                              isMobile ? "p-3" : "p-2"
                            } bg-secondary/80 backdrop-blur-sm border border-secondary rounded-lg text-white hover:bg-secondary transition-all`}
                            title="Remove image"
                          >
                            <X
                              className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`}
                            />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Multiple images grid - responsive grid
                      <div
                        className={`grid ${
                          isMobile
                            ? "grid-cols-1 sm:grid-cols-2"
                            : "grid-cols-2"
                        } gap-2 w-full h-full p-2`}
                      >
                        {previews
                          .slice(0, isMobile ? 2 : 4)
                          .map((preview, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden rounded-lg group"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Selection checkbox - larger on mobile */}
                              <div
                                className={`absolute ${
                                  isMobile ? "top-3 left-3" : "top-2 left-2"
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleImageSelection(index);
                                  }}
                                  className={`${
                                    isMobile ? "w-8 h-8" : "w-6 h-6"
                                  } rounded-full border-2 flex items-center justify-center transition-all ${
                                    selectedImages[index]
                                      ? "bg-primary border-primary"
                                      : "bg-background/50 border-white backdrop-blur-sm"
                                  }`}
                                >
                                  {selectedImages[index] && (
                                    <Check
                                      className={`${
                                        isMobile ? "w-4 h-4" : "w-3 h-3"
                                      } text-white`}
                                    />
                                  )}
                                </button>
                              </div>
                              {/* Remove button - larger on mobile */}
                              <div
                                className={`absolute ${
                                  isMobile ? "top-3 right-3" : "top-2 right-2"
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  className={`${
                                    isMobile ? "w-8 h-8" : "w-6 h-6"
                                  } bg-secondary/80 backdrop-blur-sm border border-secondary rounded-full flex items-center justify-center text-white hover:bg-secondary transition-all ${
                                    isMobile
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  <X
                                    className={`${
                                      isMobile ? "w-4 h-4" : "w-3 h-3"
                                    }`}
                                  />
                                </button>
                              </div>
                              {index === (isMobile ? 1 : 3) &&
                                previews.length > (isMobile ? 2 : 4) && (
                                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                    <span
                                      className={`text-text font-semibold ${
                                        isMobile ? "text-lg" : ""
                                      }`}
                                    >
                                      +{previews.length - (isMobile ? 2 : 4)}
                                    </span>
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl ${
                        isMobile
                          ? "opacity-0"
                          : "opacity-0 group-hover/preview:opacity-100"
                      } transition-all duration-300 flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <Upload
                          className={`${
                            isMobile ? "w-6 h-6" : "w-8 h-8"
                          } text-primary mx-auto mb-2`}
                        />
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-sm"
                          } font-medium text-text`}
                        >
                          {isMobile
                            ? "Tap to change"
                            : "Click to change images"}
                        </p>
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-xs"
                          } text-text/60 mt-1`}
                        >
                          {images.length} image{images.length > 1 ? "s" : ""}{" "}
                          selected
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center ${isMobile ? "p-4" : "p-8"}`}>
                    <div className="floating-element mb-6">
                      <div
                        className={`inline-flex items-center justify-center ${
                          isMobile ? "p-3" : "p-4"
                        } bg-primary/20 rounded-full border border-primary/30`}
                      >
                        <Upload
                          className={`${
                            isMobile ? "w-6 h-6" : "w-8 h-8"
                          } text-primary`}
                        />
                      </div>
                    </div>
                    <h3
                      className={`${
                        isMobile ? "text-lg" : "text-2xl"
                      } font-bold text-text mb-2 group-hover/upload:text-primary transition-colors`}
                    >
                      {isMobile ? "Tap to Upload" : "Drop Your Images Here"}
                    </h3>
                    <p
                      className={`text-text/60 mb-4 ${
                        isMobile ? "text-sm" : ""
                      }`}
                    >
                      {isMobile
                        ? "or tap to browse files"
                        : "or click to browse multiple files"}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 ${
                        isMobile ? "px-2 py-1" : "px-3 py-1"
                      } rounded-full bg-primary/10 border border-primary/20`}
                    >
                      <Image
                        className={`${
                          isMobile ? "w-3 h-3" : "w-4 h-4"
                        } text-primary`}
                      />
                      <span
                        className={`${
                          isMobile ? "text-xs" : "text-xs"
                        } text-primary font-medium`}
                      >
                        JPEG, PNG, WebP supported
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Management Section - Only show when there are multiple images */}
              {images.length > 1 && (
                <div className={`${isMobile ? "mb-4" : "mb-8"}`}>
                  <div
                    className={`glass rounded-2xl ${
                      isMobile ? "p-4" : "p-6"
                    } border border-primary/20`}
                  >
                    <div
                      className={`flex ${
                        isMobile
                          ? "flex-col gap-3"
                          : "items-center justify-between"
                      } mb-4`}
                    >
                      <h3
                        className={`${
                          isMobile ? "text-base" : "text-lg"
                        } font-semibold text-text flex items-center gap-2`}
                      >
                        <Image
                          className={`${
                            isMobile ? "w-4 h-4" : "w-5 h-5"
                          } text-primary`}
                        />
                        Image Management ({getSelectedCount()}/{images.length}{" "}
                        selected)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllImages}
                          className={`${
                            isMobile ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
                          } bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors touch-manipulation`}
                        >
                          Select All
                        </button>
                        <button
                          onClick={deselectAllImages}
                          className={`${
                            isMobile ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
                          } bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors touch-manipulation`}
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    {/* Image List - responsive grid */}
                    <div
                      className={`grid ${
                        isMobile
                          ? "grid-cols-2"
                          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      } gap-3`}
                    >
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group glass rounded-lg overflow-hidden border border-primary/10"
                        >
                          <img
                            src={previews[index]}
                            alt={`Image ${index + 1}`}
                            className={`w-full ${
                              isMobile ? "h-24" : "h-20"
                            } object-cover`}
                          />

                          {/* Overlay with controls - always visible on mobile */}
                          <div
                            className={`absolute inset-0 bg-background/80 backdrop-blur-sm ${
                              isMobile
                                ? "opacity-0 active:opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            } transition-all duration-200 flex items-center justify-center gap-1`}
                          >
                            <button
                              onClick={() => toggleImageSelection(index)}
                              className={`${
                                isMobile ? "p-2" : "p-1.5"
                              } rounded-lg transition-all touch-manipulation ${
                                selectedImages[index]
                                  ? "bg-primary text-white"
                                  : "bg-background/50 text-text hover:bg-primary/20"
                              }`}
                              title={
                                selectedImages[index] ? "Deselect" : "Select"
                              }
                            >
                              <Check
                                className={`${
                                  isMobile ? "w-4 h-4" : "w-3 h-3"
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => removeImage(index)}
                              className={`${
                                isMobile ? "p-2" : "p-1.5"
                              } bg-secondary/80 text-white rounded-lg hover:bg-secondary transition-all touch-manipulation`}
                              title="Remove image"
                            >
                              <X
                                className={`${
                                  isMobile ? "w-4 h-4" : "w-3 h-3"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Selection indicator - larger on mobile */}
                          <div
                            className={`absolute ${
                              isMobile ? "top-2 left-2" : "top-1 left-1"
                            }`}
                          >
                            <div
                              className={`${
                                isMobile ? "w-6 h-6" : "w-4 h-4"
                              } rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedImages[index]
                                  ? "bg-primary border-primary"
                                  : "bg-background/50 border-white backdrop-blur-sm"
                              }`}
                            >
                              {selectedImages[index] && (
                                <Check
                                  className={`${
                                    isMobile ? "w-3 h-3" : "w-2 h-2"
                                  } text-white`}
                                />
                              )}
                            </div>
                          </div>

                          {/* Image name */}
                          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1">
                            <p
                              className={`${
                                isMobile ? "text-xs" : "text-xs"
                              } text-text/80 truncate`}
                            >
                              {image.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Grid - stack on mobile */}
              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-1 gap-6"
                    : "grid-cols-1 lg:grid-cols-2 gap-8"
                } ${isMobile ? "mb-6" : "mb-8"}`}
              >
                {/* Left Column - Compression Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings
                      className={`${
                        isMobile ? "w-4 h-4" : "w-5 h-5"
                      } text-primary`}
                    />
                    <h3
                      className={`${
                        isMobile ? "text-base" : "text-lg"
                      } font-semibold text-text`}
                    >
                      Compression Settings
                    </h3>
                  </div>

                  {/* Quality Slider */}
                  <div
                    className={`glass rounded-xl ${
                      isMobile ? "p-4" : "p-6"
                    } border border-primary/20`}
                  >
                    <label
                      className={`block ${
                        isMobile ? "text-sm" : "text-sm"
                      } font-medium text-text mb-3`}
                    >
                      Quality ({quality}%)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className={`w-full ${
                          isMobile ? "h-3" : "h-2"
                        } bg-background/50 rounded-lg appearance-none cursor-pointer slider touch-manipulation`}
                        style={{
                          background: `linear-gradient(to right, #c0a6d9 0%, #c0a6d9 ${quality}%, rgba(192,166,217,0.2) ${quality}%, rgba(192,166,217,0.2) 100%)`,
                        }}
                      />
                      <div
                        className={`flex justify-between ${
                          isMobile ? "text-xs" : "text-xs"
                        } text-text/50 mt-1`}
                      >
                        <span>1%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div
                    className={`glass rounded-xl ${
                      isMobile ? "p-4" : "p-6"
                    } border border-secondary/20`}
                  >
                    <label
                      className={`block ${
                        isMobile ? "text-sm" : "text-sm"
                      } font-medium text-text mb-3`}
                    >
                      Output Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["jpeg", "png", "webp"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setFormat(fmt)}
                          className={`${
                            isMobile ? "px-3 py-3 text-sm" : "px-4 py-2 text-sm"
                          } font-medium transition-all duration-200 rounded-lg touch-manipulation ${
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
                    <Sparkles
                      className={`${
                        isMobile ? "w-4 h-4" : "w-5 h-5"
                      } text-accent`}
                    />
                    <h3
                      className={`${
                        isMobile ? "text-base" : "text-lg"
                      } font-semibold text-text`}
                    >
                      Enhancement Options
                    </h3>
                  </div>

                  {/* Rounded Corners */}
                  <div
                    className={`glass rounded-xl ${
                      isMobile ? "p-4" : "p-6"
                    } border border-accent/20`}
                  >
                    <label className="flex items-center justify-between cursor-pointer touch-manipulation">
                      <div>
                        <span
                          className={`${
                            isMobile ? "text-sm" : "text-sm"
                          } font-medium text-text`}
                        >
                          Rounded Corners
                        </span>
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-xs"
                          } text-text/60 mt-1`}
                        >
                          Add rounded corners to your image
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={roundedCorners}
                          onChange={(e) => setRoundedCorners(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`${
                            isMobile ? "w-14 h-7" : "w-12 h-6"
                          } rounded-full transition-colors duration-200 ${
                            roundedCorners ? "bg-accent" : "bg-background/50"
                          }`}
                        >
                          <div
                            className={`${
                              isMobile ? "w-6 h-6" : "w-5 h-5"
                            } bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              roundedCorners
                                ? isMobile
                                  ? "translate-x-7"
                                  : "translate-x-6"
                                : "translate-x-0.5"
                            }`}
                            style={{ marginTop: "2px" }}
                          ></div>
                        </div>
                      </div>
                    </label>

                    {roundedCorners && (
                      <div className="mt-4 pt-4 border-t border-accent/20">
                        <label
                          className={`block ${
                            isMobile ? "text-sm" : "text-sm"
                          } font-medium text-text mb-3`}
                        >
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
                          className={`w-full ${
                            isMobile ? "h-3" : "h-2"
                          } bg-background/50 rounded-lg appearance-none cursor-pointer touch-manipulation`}
                          style={{
                            background: `linear-gradient(to right, #bd6567 0%, #bd6567 ${cornerRadius}%, rgba(189,101,103,0.2) ${cornerRadius}%, rgba(189,101,103,0.2) 100%)`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <div
                    className={`glass rounded-xl ${
                      isMobile ? "p-4" : "p-6"
                    } border border-text/10`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`${
                          isMobile ? "p-1.5" : "p-2"
                        } bg-primary/20 rounded-lg`}
                      >
                        <Zap
                          className={`${
                            isMobile ? "w-3 h-3" : "w-4 h-4"
                          } text-primary`}
                        />
                      </div>
                      <div>
                        <h4
                          className={`${
                            isMobile ? "text-sm" : "text-sm"
                          } font-medium text-text mb-1`}
                        >
                          Processing Info
                        </h4>
                        <p
                          className={`${
                            isMobile ? "text-xs" : "text-xs"
                          } text-text/60 leading-relaxed`}
                        >
                          All processing happens in your browser. Your images
                          never leave your device.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Button - optimized for mobile */}
              <div className="relative space-y-4">
                <button
                  onClick={handleCompression}
                  disabled={
                    images.length === 0 ||
                    processing ||
                    getSelectedCount() === 0
                  }
                  className={`w-full ${
                    isMobile ? "py-5 px-6 text-base" : "py-4 px-8"
                  } bg-primary text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn touch-manipulation`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <div
                        className={`${
                          isMobile ? "w-6 h-6" : "w-5 h-5"
                        } border-2 border-background/30 border-t-background rounded-full animate-spin`}
                      ></div>
                      <span className={isMobile ? "text-sm" : ""}>
                        Processing {getSelectedCount()} image
                        {getSelectedCount() > 1 ? "s" : ""}...
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Download
                        className={`${
                          isMobile ? "w-6 h-6" : "w-5 h-5"
                        } group-hover/btn:animate-bounce`}
                      />
                      <span className={isMobile ? "text-sm" : ""}>
                        {isMobile
                          ? "Compress & Download"
                          : "Compress & Download"}{" "}
                        {images.length > 1
                          ? `(${getSelectedCount()} selected)`
                          : ""}
                      </span>
                    </span>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleOpenSocialShare}
                  className={`w-full ${
                    isMobile ? "py-3 px-6 text-sm" : "py-3 px-8 text-sm"
                  } glass border border-accent/30 text-accent font-medium rounded-xl hover:bg-accent/10 transition-all duration-300 touch-manipulation flex items-center justify-center gap-3`}
                >
                  <Share2 className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                  Share Image Composer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShare
        isOpen={showSocialShare}
        onClose={handleCloseSocialShare}
        shareData={shareData}
      />
    </section>
  );
};

export default ImageComposerUI;

import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  FileImage,
  Info,
  Sparkles,
  Settings,
  Sliders,
  Eye,
  Code,
} from "lucide-react";
import { Button } from "../components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useIsMobile } from "../hooks/useIsMobile";

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
}

interface SvgOptions {
  quality: number;
  backgroundColor: string;
  transparent: boolean;
  embedImage: boolean;
  optimizeSvg: boolean;
  includeMetadata: boolean;
}

const SvgConverter: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [svgOutput, setSvgOutput] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewScale, setPreviewScale] = useState(1);
  const [customWidth, setCustomWidth] = useState<number | "">("");
  const [customHeight, setCustomHeight] = useState<number | "">("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: false,
  });

  const [svgOptions, setSvgOptions] = useState<SvgOptions>({
    quality: 90,
    backgroundColor: "#ffffff",
    transparent: true,
    embedImage: true,
    optimizeSvg: true,
    includeMetadata: false,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setError("");
        setSvgOutput("");
        setCustomWidth("");
        setCustomHeight("");
        setOriginalDimensions(null);

        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setCustomWidth(img.width);
          setCustomHeight(img.height);
        };
        img.src = URL.createObjectURL(file);

        toast.success("🖼️ Image uploaded successfully!", {
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #c0a6d9",
          },
        });
      } else {
        setError("Please select a valid image file (PNG, JPG, etc.)");
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

  const handleDimensionChange = (
    dimension: "width" | "height",
    value: string
  ) => {
    const numValue = value === "" ? "" : Number(value);

    if (dimension === "width") {
      setCustomWidth(numValue);
      if (maintainAspectRatio && originalDimensions && numValue !== "") {
        const newHeight = Math.round(
          (numValue as number) *
            (originalDimensions.height / originalDimensions.width)
        );
        setCustomHeight(newHeight);
      }
    } else {
      setCustomHeight(numValue);
      if (maintainAspectRatio && originalDimensions && numValue !== "") {
        const newWidth = Math.round(
          (numValue as number) *
            (originalDimensions.width / originalDimensions.height)
        );
        setCustomWidth(newWidth);
      }
    }
  };

  const applyImageAdjustments = (ctx: CanvasRenderingContext2D) => {
    ctx.filter = "none";

    const filters = [];

    if (imageAdjustments.brightness !== 100) {
      filters.push(`brightness(${imageAdjustments.brightness / 100})`);
    }
    if (imageAdjustments.contrast !== 100) {
      filters.push(`contrast(${imageAdjustments.contrast}%)`);
    }
    if (imageAdjustments.saturation !== 100) {
      filters.push(`saturate(${imageAdjustments.saturation}%)`);
    }
    if (imageAdjustments.blur > 0) {
      filters.push(`blur(${imageAdjustments.blur}px)`);
    }
    if (imageAdjustments.grayscale) {
      filters.push("grayscale(100%)");
    }

    if (filters.length > 0) {
      ctx.filter = filters.join(" ");
    }
  };

  const convertToSvg = async () => {
    if (!selectedFile || !customWidth || !customHeight) {
      toast.error("❌ Please set both width and height", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
      return;
    }

    setIsConverting(true);
    setError("");

    const loadingToast = toast.loading("🔄 Converting image to SVG...", {
      style: {
        background: "#0d0915",
        color: "#ede6f4",
        border: "1px solid #c0a6d9",
      },
    });

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = Number(customWidth);
          canvas.height = Number(customHeight);

          const ctx = canvas.getContext("2d", {
            willReadFrequently: true,
            alpha: true,
          });

          if (!ctx) {
            setError("Failed to get canvas context");
            toast.dismiss(loadingToast);
            toast.error("❌ Failed to process image", {
              style: {
                background: "#0d0915",
                color: "#ede6f4",
                border: "1px solid #7d3650",
              },
            });
            setIsConverting(false);
            return;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (!svgOptions.transparent) {
            ctx.fillStyle = svgOptions.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          applyImageAdjustments(ctx);

          ctx.drawImage(img, 0, 0, Number(customWidth), Number(customHeight));

          let svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
          svgString += `<svg xmlns="http://www.w3.org/2000/svg" width="${customWidth}" height="${customHeight}"`;

          if (
            Number(customWidth) !== img.width ||
            Number(customHeight) !== img.height
          ) {
            svgString += ` viewBox="0 0 ${customWidth} ${customHeight}"`;
          }

          svgString += ` style="background: ${
            svgOptions.transparent ? "none" : svgOptions.backgroundColor
          };">\n`;

          if (svgOptions.includeMetadata) {
            svgString += `  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>Converted by Image Composer</dc:title>
        <dc:creator>Image Composer SVG Converter</dc:creator>
        <dc:date>${new Date().toISOString()}</dc:date>
      </rdf:Description>
    </rdf:RDF>
  </metadata>\n`;
          }

          const imageData = canvas.toDataURL(
            "image/png",
            svgOptions.quality / 100
          );

          if (svgOptions.embedImage) {
            svgString += `  <image href="${imageData}" width="100%" height="100%" preserveAspectRatio="none" style="mix-blend-mode: normal;"/>\n`;
          } else {
            const blob = new Blob([imageData], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            svgString += `  <image href="${imageUrl}" width="100%" height="100%" preserveAspectRatio="none" style="mix-blend-mode: normal;"/>\n`;
          }

          svgString += `</svg>`;

          if (svgOptions.optimizeSvg) {
            svgString = svgString
              .replace(/\s+/g, " ")
              .replace(/>\s+</g, "><")
              .replace(/\s+\/>/g, "/>")
              .trim();
          }

          setSvgOutput(svgString);
          setPreviewScale(1);
          setIsConverting(false);
          toast.dismiss(loadingToast);
          toast.success("✨ Image converted successfully!", {
            style: {
              background: "#0d0915",
              color: "#ede6f4",
              border: "1px solid #bd6567",
            },
          });
        };

        img.onerror = () => {
          setError("Failed to load image");
          toast.dismiss(loadingToast);
          toast.error("❌ Failed to load image", {
            style: {
              background: "#0d0915",
              color: "#ede6f4",
              border: "1px solid #7d3650",
            },
          });
          setIsConverting(false);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        setError("Failed to read file");
        toast.dismiss(loadingToast);
        toast.error("❌ Failed to read file", {
          style: {
            background: "#0d0915",
            color: "#ede6f4",
            border: "1px solid #7d3650",
          },
        });
        setIsConverting(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError("Error converting image to SVG. Please try again.");
      toast.dismiss(loadingToast);
      toast.error("❌ Conversion failed", {
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
      console.error(err);
      setIsConverting(false);
    }
  };

  const downloadSvg = () => {
    if (!svgOutput) return;

    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFile?.name.split(".")[0] || "converted"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("🎉 SVG downloaded successfully!", {
      duration: 3000,
      style: {
        background: "#0d0915",
        color: "#ede6f4",
        border: "1px solid #bd6567",
      },
    });
  };

  const adjustScale = (direction: "up" | "down") => {
    setPreviewScale((prev) => (direction === "up" ? prev * 1.2 : prev / 1.2));
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
                Image to SVG Converter
              </span>
            </div>

            <h1
              className={`${
                isMobile ? "text-3xl sm:text-4xl" : "text-5xl"
              } font-bold tracking-tight text-text sm:text-6xl bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent`}
            >
              PNG/JPG to SVG Converter
            </h1>
            <p className="mt-6 text-lg leading-8 text-text/70">
              Transform your raster images into SVG format while preserving
              colors and quality.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="glass rounded-3xl p-8 border border-primary/20 backdrop-blur-xl">
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
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-16 h-16 text-primary mb-4 floating-element" />
                  <span className="text-xl font-medium text-text mb-2">
                    {selectedFile ? selectedFile.name : "Choose an image"}
                  </span>
                  <span className="text-sm text-text/60">
                    Drop your PNG or JPG image here, or click to browse
                  </span>
                </label>
              </div>
            </div>
          </div>

          {selectedFile && originalDimensions && (
            <div className="mb-8 p-6 bg-background/30 rounded-xl border border-primary/20">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text">Dimensions</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="aspectRatio"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded border-primary/20"
                    />
                    <label
                      htmlFor="aspectRatio"
                      className="text-sm text-text/70"
                    >
                      Maintain aspect ratio
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-text/70">Width (px)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) =>
                          handleDimensionChange("width", e.target.value)
                        }
                        min="1"
                        className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg text-text focus:outline-none focus:border-primary/40"
                        placeholder="Width"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-text/70">Height (px)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) =>
                          handleDimensionChange("height", e.target.value)
                        }
                        min="1"
                        className="w-full px-4 py-2 bg-background/50 border border-primary/20 rounded-lg text-text focus:outline-none focus:border-primary/40"
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-text/50 italic">
                  Original dimensions: {originalDimensions.width}px ×{" "}
                  {originalDimensions.height}px
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {error}
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {showAdvancedSettings
                  ? "Hide Advanced Settings"
                  : "Show Advanced Settings"}
              </Button>
            </div>
          )}

          {showAdvancedSettings && selectedFile && (
            <div className="mb-8 space-y-6">
              <div className="p-6 bg-background/30 rounded-xl border border-primary/20">
                <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Image Adjustments
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text/70 mb-2 block">
                      Brightness
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={imageAdjustments.brightness}
                      onChange={(e) =>
                        setImageAdjustments((prev) => ({
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
                      min="0"
                      max="200"
                      value={imageAdjustments.contrast}
                      onChange={(e) =>
                        setImageAdjustments((prev) => ({
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
                      min="0"
                      max="200"
                      value={imageAdjustments.saturation}
                      onChange={(e) =>
                        setImageAdjustments((prev) => ({
                          ...prev,
                          saturation: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text/70 mb-2 block">
                      Blur
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={imageAdjustments.blur}
                      onChange={(e) =>
                        setImageAdjustments((prev) => ({
                          ...prev,
                          blur: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="grayscale"
                      checked={imageAdjustments.grayscale}
                      onChange={(e) =>
                        setImageAdjustments((prev) => ({
                          ...prev,
                          grayscale: e.target.checked,
                        }))
                      }
                      className="rounded border-primary/20"
                    />
                    <label htmlFor="grayscale" className="text-sm text-text/70">
                      Convert to Grayscale
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-background/30 rounded-xl border border-primary/20">
                <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  SVG Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text/70 mb-2 block">
                      Quality
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={svgOptions.quality}
                      onChange={(e) =>
                        setSvgOptions((prev) => ({
                          ...prev,
                          quality: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-text/50">
                      {svgOptions.quality}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-text/70 mb-2 block">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={svgOptions.backgroundColor}
                        onChange={(e) =>
                          setSvgOptions((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                          }))
                        }
                        className="w-full h-8 rounded border border-primary/20"
                        disabled={svgOptions.transparent}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="transparent"
                        checked={svgOptions.transparent}
                        onChange={(e) =>
                          setSvgOptions((prev) => ({
                            ...prev,
                            transparent: e.target.checked,
                          }))
                        }
                        className="rounded border-primary/20"
                      />
                      <label
                        htmlFor="transparent"
                        className="text-sm text-text/70"
                      >
                        Transparent Background
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="embedImage"
                        checked={svgOptions.embedImage}
                        onChange={(e) =>
                          setSvgOptions((prev) => ({
                            ...prev,
                            embedImage: e.target.checked,
                          }))
                        }
                        className="rounded border-primary/20"
                      />
                      <label
                        htmlFor="embedImage"
                        className="text-sm text-text/70"
                      >
                        Embed Image (Base64)
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="optimizeSvg"
                        checked={svgOptions.optimizeSvg}
                        onChange={(e) =>
                          setSvgOptions((prev) => ({
                            ...prev,
                            optimizeSvg: e.target.checked,
                          }))
                        }
                        className="rounded border-primary/20"
                      />
                      <label
                        htmlFor="optimizeSvg"
                        className="text-sm text-text/70"
                      >
                        Optimize SVG Output
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="includeMetadata"
                        checked={svgOptions.includeMetadata}
                        onChange={(e) =>
                          setSvgOptions((prev) => ({
                            ...prev,
                            includeMetadata: e.target.checked,
                          }))
                        }
                        className="rounded border-primary/20"
                      />
                      <label
                        htmlFor="includeMetadata"
                        className="text-sm text-text/70"
                      >
                        Include SVG Metadata
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={convertToSvg}
              disabled={!selectedFile || isConverting}
              className="flex items-center gap-2 px-6 py-2 text-lg"
            >
              <FileImage className="w-5 h-5" />
              {isConverting ? "Converting..." : "Convert to SVG"}
            </Button>

            {svgOutput && (
              <Button
                onClick={downloadSvg}
                variant="outline"
                className="flex items-center gap-2 px-6 py-2 text-lg"
              >
                <ImageIcon className="w-5 h-5" />
                Download SVG
              </Button>
            )}
          </div>

          {svgOutput && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text">Preview:</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScale("down")}
                    className="px-3"
                  >
                    -
                  </Button>
                  <span className="text-sm text-text/70">Zoom</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustScale("up")}
                    className="px-3"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-background/50 rounded-xl border border-primary/20 overflow-auto max-h-[600px]">
                <div
                  className="w-full min-h-[400px] flex items-center justify-center rounded-lg"
                  style={{
                    background:
                      "repeating-casing-pattern 10px 10px, #f0f0f0 0 20px",
                    backgroundImage:
                      "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    opacity: 0.1,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: svgOutput.replace(
                      /<svg/,
                      `<svg style="transform: scale(${previewScale}); transition: transform 0.2s ease-in-out;"`
                    ),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SvgConverter;

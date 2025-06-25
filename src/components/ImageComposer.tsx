import React, { useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { compressImage, applyRoundedCorners } from "../utils/imageProcessing";
import { Upload, Settings, Download, Image, Zap, Sparkles } from "lucide-react";

const ImageComposer: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [roundedCorners, setRoundedCorners] = useState<boolean>(false);
  const [cornerRadius, setCornerRadius] = useState<number>(10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageSelect(file);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageSelect(file);
    }
  };

  const handleImageSelect = async (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCompression = async () => {
    if (!image) return;

    try {
      setProcessing(true);

      // First compress the image
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

      // Create download link
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = `compressed_image.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process image");
    } finally {
      setProcessing(false);
    }
  };

  return (
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
                      : preview
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
                  onChange={handleFileSelect}
                />

                {preview ? (
                  <div className="relative w-full h-full group/preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-text">
                          Click to change image
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
                      Drop Your Image Here
                    </h3>
                    <p className="text-text/60 mb-4">
                      or click to browse files
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
                          onChange={(e) => setRoundedCorners(e.target.checked)}
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
                  disabled={!image || processing}
                  className="w-full py-4 px-8 bg-primary text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group/btn"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Processing your image...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                      Compress & Download
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageComposer;

import React, { useState } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Download,
  X,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  shareData?: {
    imageCount?: number;
    compressionRatio?: number;
    originalSize?: string;
    compressedSize?: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({
  isOpen,
  onClose,
  shareData,
}) => {
  const { isMobile } = useIsMobile();
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const defaultMessage =
    "🖼️ Just compressed my images with Image Composer! Reduced file sizes by up to 90% while maintaining perfect quality. It's free, secure, and works entirely in your browser! ✨";

  const customMessage = shareData
    ? `🖼️ Amazing! Just compressed ${shareData.imageCount || 1} image${
        shareData.imageCount && shareData.imageCount > 1 ? "s" : ""
      } with Image Composer! ${
        shareData.compressionRatio
          ? `Achieved ${shareData.compressionRatio}% size reduction`
          : "Reduced file sizes by up to 90%"
      } while maintaining perfect quality! 🚀✨`
    : defaultMessage;

  const hashtags =
    "#ImageCompression #PhotoOptimization #WebDev #ImageProcessor #FreeTools #PhotoEditor";
  const twitterHashtags =
    "ImageCompression,PhotoOptimization,WebDev,ImageProcessor,FreeTools";

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-blue-500/20 hover:text-blue-400",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        customMessage
      )}&url=${encodeURIComponent(baseUrl)}&hashtags=${encodeURIComponent(
        twitterHashtags
      )}&via=abdul_rafay99`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-600/20 hover:text-blue-500",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        baseUrl
      )}&quote=${encodeURIComponent(customMessage)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-700/20 hover:text-blue-600",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        baseUrl
      )}&summary=${encodeURIComponent(customMessage)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-500/20 hover:text-green-400",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${customMessage} ${baseUrl}`
      )}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-gray-500/20 hover:text-gray-400",
      url: `mailto:?subject=${encodeURIComponent(
        "Check out Image Composer - Professional Image Compression"
      )}&body=${encodeURIComponent(
        `${customMessage}\n\nTry it here: ${baseUrl}`
      )}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(baseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = baseUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Image Composer - Professional Image Compression",
          text: customMessage,
          url: baseUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  const handleSocialShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`relative glass rounded-3xl ${
          isMobile ? "p-6 max-w-sm w-full" : "p-8 max-w-md w-full"
        } backdrop-blur-xl border border-primary/20`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-text/60 hover:text-text hover:bg-background/50 transition-all touch-manipulation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-xl border border-primary/30 mb-4">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <h3
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-bold text-text mb-2`}
          >
            Share Image Composer
          </h3>
          <p className={`text-text/70 ${isMobile ? "text-sm" : ""}`}>
            Help others discover this amazing image compression tool!
          </p>
        </div>

        {/* Share Results (if available) */}
        {shareData && (
          <div className="mb-6 p-4 glass rounded-xl border border-accent/20">
            <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Your Compression Results
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text/60">Images:</span>
                <span className="ml-1 text-text font-medium">
                  {shareData.imageCount || 1}
                </span>
              </div>
              {shareData.compressionRatio && (
                <div>
                  <span className="text-text/60">Reduction:</span>
                  <span className="ml-1 text-primary font-medium">
                    {shareData.compressionRatio}%
                  </span>
                </div>
              )}
              {shareData.originalSize && (
                <div>
                  <span className="text-text/60">Original:</span>
                  <span className="ml-1 text-text font-medium">
                    {shareData.originalSize}
                  </span>
                </div>
              )}
              {shareData.compressedSize && (
                <div>
                  <span className="text-text/60">Compressed:</span>
                  <span className="ml-1 text-accent font-medium">
                    {shareData.compressedSize}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Native Share Button (Mobile) */}
        {isMobile && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            className="w-full mb-4 p-4 glass rounded-xl border border-primary/20 text-text hover:border-primary/40 transition-all touch-manipulation flex items-center justify-center gap-3"
          >
            <Share2 className="w-5 h-5 text-primary" />
            <span className="font-medium">Share via System</span>
          </button>
        )}

        {/* Social Media Links */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-text/80 mb-3">
            Share on Social Media
          </h4>
          <div
            className={`grid ${
              isMobile ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3"
            }`}
          >
            {shareLinks.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleSocialShare(platform.url)}
                className={`p-3 glass rounded-xl border border-primary/20 text-text/80 ${platform.color} transition-all duration-300 flex items-center gap-3 touch-manipulation`}
              >
                <platform.icon className="w-5 h-5" />
                <span className="font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy Link */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text/80">Copy Link</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={baseUrl}
              readOnly
              className="flex-1 p-3 bg-background/50 border border-primary/20 rounded-xl text-text/80 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`p-3 rounded-xl border transition-all touch-manipulation ${
                copied
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "glass border-primary/20 text-text/80 hover:border-primary/40"
              }`}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-xs text-center">
              ✅ Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Share Message Preview */}
        <div className="mt-6 pt-4 border-t border-primary/20">
          <h4 className="text-xs font-semibold text-text/60 mb-2">
            Share Message:
          </h4>
          <p className="text-xs text-text/70 bg-background/30 p-3 rounded-lg border border-primary/10">
            {customMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;

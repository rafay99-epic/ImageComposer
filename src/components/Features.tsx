import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Image,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Globe,
  BookImage,
  FileImage,
  ArrowRight,
  Award,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  color: "primary" | "secondary" | "accent";
  link: string;
}

interface MainFeature extends Feature {
  benefits?: string[];
}

interface FeaturesProps {
  variant?: "landing" | "page";
  selectedFeature?: string;
}

const Features: React.FC<FeaturesProps> = ({
  variant = "landing",
  selectedFeature,
}) => {
  // Main features section
  const mainFeatures: MainFeature[] = [
    {
      title: "Image Compression",
      description:
        "Compress images up to 90% while maintaining perfect quality. Support for JPEG, PNG, and WebP formats.",
      icon: <Image className="w-12 h-12" />,
      color: "primary",
      link: "/image-composer",
      benefits: [
        "Reduce file size by up to 90%",
        "Maintain original image quality",
        "Support for multiple formats",
        "Batch processing capability",
      ],
    },
    {
      title: "SVG Converter",
      description:
        "Convert your PNG and JPG images to scalable SVG format with advanced customization options.",
      icon: <FileImage className="w-12 h-12" />,
      color: "accent",
      link: "/svg-converter",
      benefits: [
        "Convert raster to vector format",
        "Customizable output settings",
        "Preserve image quality at any size",
        "Professional SVG optimization",
      ],
    },
    {
      title: "AI Image Enhancement",
      description:
        "Transform your images with smart AI upscaling. Automatically selects between Real-ESRGAN for small images and ControlNet for detailed enhancements.",
      icon: <Sparkles className="w-12 h-12" />,
      color: "secondary",
      link: "/image-enhancer",
      benefits: [
        "Smart AI-powered upscaling",
        "Automatic model selection",
        "Detail preservation",
        "Professional results",
      ],
    },
    {
      title: "Manual Image Enhancement",
      description:
        "Fine-tune your images with manual adjustments. Adjust brightness, contrast, saturation, and more to get the perfect look.",
      icon: <BookImage className="w-12 h-12" />,
      color: "secondary",
      link: "/manual-enhancer",
      benefits: [
        "Complete control over adjustments",
        "Professional-grade filters",
        "Real-time preview",
        "Multiple enhancement presets",
      ],
    },
  ];

  // Regular features for landing page
  const features: Feature[] = [
    {
      title: "Lightning Fast Compression",
      description:
        "Advanced algorithms that compress images up to 90% while maintaining crystal-clear quality.",
      color: "primary",
      icon: <Zap className="w-8 h-8" />,
      link: "/",
    },
    {
      title: "Smart Format Conversion",
      description:
        "Seamlessly convert between JPEG, PNG, and WebP with intelligent format optimization.",
      color: "accent",
      icon: <Layers className="w-8 h-8" />,
      link: "/smart-format-conversion",
    },
    {
      title: "Professional Enhancement",
      description:
        "Advanced image refinements including corner rounding, filters, and aspect ratio optimization.",
      color: "secondary",
      icon: <Sparkles className="w-8 h-8" />,
      link: "/professional-enhancement",
    },
    {
      title: "Enterprise Security",
      description:
        "100% client-side processing ensures your images never leave your device. GDPR compliant.",
      color: "primary",
      icon: <Shield className="w-8 h-8" />,
      link: "/enterprise-security",
    },
  ];

  if (variant === "page") {
    // For individual feature pages, show a different layout
    const feature = mainFeatures.find((f) => f.title === selectedFeature);
    if (!feature) return null;

    return (
      <section className="relative py-16 bg-background overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Feature Header */}
            <div className="text-center mb-12">
              <div
                className={`w-16 h-16 mx-auto mb-6 p-3 rounded-2xl bg-${feature.color}/20 border border-${feature.color}/30`}
              >
                <div className={`text-${feature.color}`}>{feature.icon}</div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <p className="text-lg text-text/70">{feature.description}</p>
            </div>

            {/* Benefits Grid */}
            {feature.benefits && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feature.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 glass rounded-xl border border-primary/20"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-text/80">{benefit}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Landing page layout (default)
  return (
    <section className="relative py-24 bg-background overflow-hidden">
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text/80">
              Enterprise Features
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
            Powerful Image Processing
          </h2>
          <p className="text-xl text-text/70 leading-relaxed">
            Professional-grade tools designed for businesses and enterprises who
            demand
            <span className="text-primary font-semibold">
              {" "}
              exceptional quality
            </span>{" "}
            and performance.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {mainFeatures.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <Link
                key={index}
                to={feature.link}
                className={`group relative glass rounded-3xl p-10 border ${colors.cardBorder} ${colors.cardHover} transition-all duration-300 hover:scale-[1.02] min-h-[280px] flex flex-col`}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`w-fit p-4 rounded-2xl ${colors.iconBg} border ${colors.iconBorder} mb-6`}
                  >
                    <div className={colors.iconText}>{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text/70 text-lg mb-6">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className={`${colors.iconText} text-lg flex items-center gap-2 hover:translate-x-2 transition-transform`}
                    >
                      Try Now
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Regular Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`glass rounded-2xl p-8 border ${colors.cardBorder} ${colors.cardHover} transition-all duration-300`}
              >
                <div
                  className={`w-fit p-3 rounded-xl ${colors.iconBg} border ${colors.iconBorder} mb-4`}
                >
                  <div className={colors.iconText}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-text">
                  {feature.title}
                </h3>
                <p className="text-text/70">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const getColorClasses = (color: "primary" | "secondary" | "accent") => {
  switch (color) {
    case "primary":
      return {
        iconBg: "bg-primary/20",
        iconBorder: "border-primary/30",
        iconText: "text-primary",
        cardBorder: "border-primary/20",
        cardHover: "hover:border-primary/40",
      };
    case "secondary":
      return {
        iconBg: "bg-secondary/20",
        iconBorder: "border-secondary/30",
        iconText: "text-secondary",
        cardBorder: "border-secondary/20",
        cardHover: "hover:border-secondary/40",
      };
    case "accent":
      return {
        iconBg: "bg-accent/20",
        iconBorder: "border-accent/30",
        iconText: "text-accent",
        cardBorder: "border-accent/20",
        cardHover: "hover:border-accent/40",
      };
  }
};

export default Features;

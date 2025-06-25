import React from "react";
import {
  Zap,
  Image,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Globe,
  Award,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  color: "primary" | "secondary" | "accent";
}

const Features: React.FC = () => {
  const { isMobile, isTablet } = useIsMobile();

  const features: Feature[] = [
    {
      title: "Lightning Fast Compression",
      description:
        "Advanced algorithms that compress images up to 90% while maintaining crystal-clear quality.",
      color: "primary",
      icon: <Zap className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
    {
      title: "Smart Format Conversion",
      description:
        "Seamlessly convert between JPEG, PNG, and WebP with intelligent format optimization.",
      color: "accent",
      icon: <Layers className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
    {
      title: "Professional Enhancement",
      description:
        "Advanced image refinements including corner rounding, filters, and aspect ratio optimization.",
      color: "secondary",
      icon: <Sparkles className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
    {
      title: "Enterprise Security",
      description:
        "100% client-side processing ensures your images never leave your device. GDPR compliant.",
      color: "primary",
      icon: <Shield className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
    {
      title: "Batch Processing",
      description:
        "Process multiple images simultaneously with our powerful batch optimization engine.",
      color: "accent",
      icon: <Cpu className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
    {
      title: "Universal Compatibility",
      description:
        "Works perfectly across all modern browsers and devices. No downloads required.",
      color: "secondary",
      icon: <Globe className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />,
    },
  ];

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

  return (
    <section
      id="features"
      className={`relative ${
        isMobile ? "py-16" : "py-32"
      } bg-background overflow-hidden`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs - responsive sizing */}
        <div
          className={`absolute ${
            isMobile ? "top-5 right-5 w-20 h-20" : "top-10 right-10 w-40 h-40"
          } bg-primary/10 rounded-full blur-2xl animate-float`}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "bottom-10 left-10 w-16 h-16"
              : "bottom-20 left-20 w-32 h-32"
          } bg-accent/10 rounded-full blur-2xl animate-float`}
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "top-1/3 left-1/3 w-12 h-12"
              : "top-1/2 left-1/2 w-24 h-24"
          } bg-secondary/10 rounded-full blur-xl animate-float`}
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Grid pattern - responsive sizing */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.05)_1px,transparent_1px)] ${
            isMobile ? "bg-[size:30px_30px]" : "bg-[size:60px_60px]"
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
          } mx-auto ${isMobile ? "mb-12" : "mb-20"}`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 ${
              isMobile ? "px-3 py-1.5" : "px-4 py-2"
            } rounded-full glass border border-primary/30 mb-6`}
          >
            <Award
              className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} text-primary`}
            />
            <span
              className={`${
                isMobile ? "text-xs" : "text-sm"
              } font-medium text-text/80`}
            >
              Enterprise Features
            </span>
          </div>

          <h2
            className={`${
              isMobile ? "text-2xl sm:text-3xl" : "text-4xl lg:text-5xl"
            } font-bold mb-6 bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent`}
          >
            Powerful Image Processing
          </h2>
          <p
            className={`${
              isMobile ? "text-base" : "text-xl"
            } text-text/70 leading-relaxed ${isMobile ? "px-2" : ""}`}
          >
            Professional-grade tools designed for businesses and enterprises who
            demand
            <span className="text-primary font-semibold">
              {" "}
              exceptional quality
            </span>{" "}
            and performance.
          </p>
        </div>

        {/* Features Grid - responsive grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-6"
              : isTablet
              ? "grid-cols-2 gap-6"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          }`}
        >
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`group relative glass rounded-2xl ${
                  isMobile ? "p-6" : "p-8"
                } backdrop-blur-lg border ${colors.cardBorder} ${
                  colors.cardHover
                } transition-all duration-500 ${
                  isMobile ? "hover:scale-102" : "hover:scale-105"
                } hover:shadow-2xl touch-manipulation`}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color} to-${feature.color}/50 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
                ></div>

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center ${
                      isMobile ? "p-3" : "p-4"
                    } ${colors.iconBg} ${colors.iconText} rounded-xl border ${
                      colors.iconBorder
                    } mb-6 floating-element`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className={`${
                      isMobile ? "text-lg" : "text-xl"
                    } font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300`}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-text/70 leading-relaxed ${
                      isMobile ? "text-sm" : ""
                    }`}
                  >
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div
                    className={`absolute top-4 right-4 w-2 h-2 bg-${feature.color}/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA - responsive styling */}
        <div className={`text-center ${isMobile ? "mt-12" : "mt-20"}`}>
          <div
            className={`inline-flex items-center gap-2 ${
              isMobile ? "px-4 py-2" : "px-6 py-3"
            } glass rounded-full border border-primary/30 backdrop-blur-lg touch-manipulation`}
          >
            <Image
              className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-primary`}
            />
            <span
              className={`text-text/80 font-medium ${
                isMobile ? "text-sm" : ""
              }`}
            >
              Ready to transform your images?
            </span>
            <a
              href="#composer"
              className={`text-primary hover:text-primary/80 font-semibold transition-colors ${
                isMobile ? "text-sm" : ""
              }`}
            >
              Get Started →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

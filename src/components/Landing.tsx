import React from "react";
import { Button } from "./ui/button";
import { ImageIcon, Sparkles, Zap, Shield, Download } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

const Landing: React.FC = () => {
  const { isMobile, isTablet } = useIsMobile();

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs - responsive sizing */}
        <div
          className={`absolute ${
            isMobile ? "top-10 left-5 w-16 h-16" : "top-20 left-10 w-32 h-32"
          } bg-primary/20 rounded-full blur-xl animate-float`}
        ></div>
        <div
          className={`absolute ${
            isMobile ? "top-20 right-10 w-12 h-12" : "top-40 right-20 w-24 h-24"
          } bg-accent/20 rounded-full blur-xl animate-float`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute ${
            isMobile
              ? "bottom-20 left-1/4 w-20 h-20"
              : "bottom-40 left-1/4 w-40 h-40"
          } bg-secondary/20 rounded-full blur-xl animate-float`}
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Grid pattern - responsive sizing */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.1)_1px,transparent_1px)] ${
            isMobile ? "bg-[size:25px_25px]" : "bg-[size:50px_50px]"
          } [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]`}
        ></div>
      </div>

      <div
        className={`${isMobile ? "px-4" : "container-custom"} relative z-10 ${
          isMobile ? "pt-8 pb-16" : "pt-20 pb-32"
        }`}
      >
        <div
          className={`${
            isMobile
              ? "space-y-12"
              : "lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
          }`}
        >
          {/* Content */}
          <div
            className={`${
              isMobile ? "max-w-full" : "max-w-2xl mx-auto lg:mx-0"
            } text-center ${isMobile ? "" : "lg:text-left"}`}
          >
            {/* Badge */}
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
                Enterprise Image Processing
              </span>
            </div>

            {/* Main heading - responsive typography */}
            <h1
              className={`${
                isMobile
                  ? "text-3xl sm:text-4xl"
                  : isTablet
                  ? "text-5xl"
                  : "text-5xl lg:text-7xl"
              } font-bold tracking-tight ${
                isMobile ? "mb-4" : "mb-6"
              } bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent`}
            >
              Transform Images
              <br />
              <span className="text-primary glow-effect">Professionally</span>
            </h1>

            {/* Description - responsive text */}
            <p
              className={`${
                isMobile ? "text-base sm:text-lg" : "text-xl"
              } text-text/70 ${isMobile ? "mb-6" : "mb-8"} leading-relaxed ${
                isMobile ? "px-2" : ""
              }`}
            >
              Advanced image compression and optimization that maintains perfect
              quality while reducing file sizes by up to{" "}
              <span className="text-primary font-semibold">90%</span>.
            </p>

            {/* CTA Buttons - responsive sizing and touch-friendly */}
            <div
              className={`flex ${
                isMobile ? "flex-col" : "flex-col sm:flex-row"
              } gap-4 ${isMobile ? "mb-8" : "mb-12"}`}
            >
              <a href="#composer">
                <Button
                  className={`btn btn-primary ${
                    isMobile ? "text-base px-6 py-4" : "text-lg px-8 py-4"
                  } group w-full ${
                    isMobile ? "" : "sm:w-auto"
                  } touch-manipulation`}
                >
                  Start Optimizing
                  <Zap
                    className={`ml-2 ${
                      isMobile ? "h-4 w-4" : "h-5 w-5"
                    } group-hover:animate-pulse`}
                  />
                </Button>
              </a>
              <a href="#features">
                <Button
                  className={`btn btn-outline ${
                    isMobile ? "text-base px-6 py-4" : "text-lg px-8 py-4"
                  } w-full ${isMobile ? "" : "sm:w-auto"} touch-manipulation`}
                >
                  View Features
                </Button>
              </a>
            </div>

            {/* Stats - responsive grid */}
            <div
              className={`grid grid-cols-3 ${isMobile ? "gap-3" : "gap-6"} ${
                isMobile ? "pt-6" : "pt-8"
              } border-t border-primary/20`}
            >
              <div className="text-center">
                <div
                  className={`${
                    isMobile ? "text-xl" : "text-2xl"
                  } font-bold text-primary`}
                >
                  90%
                </div>
                <div
                  className={`${isMobile ? "text-xs" : "text-sm"} text-text/60`}
                >
                  Size Reduction
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`${
                    isMobile ? "text-xl" : "text-2xl"
                  } font-bold text-accent`}
                >
                  100%
                </div>
                <div
                  className={`${isMobile ? "text-xs" : "text-sm"} text-text/60`}
                >
                  Client-side
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`${
                    isMobile ? "text-xl" : "text-2xl"
                  } font-bold text-secondary`}
                >
                  ∞
                </div>
                <div
                  className={`${isMobile ? "text-xs" : "text-sm"} text-text/60`}
                >
                  Unlimited Use
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Area - responsive sizing */}
          <div className={`relative ${isMobile ? "mt-12" : "mt-16 lg:mt-0"}`}>
            {/* Main container with glass effect */}
            <div className="relative">
              {/* Glowing border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>

              {/* Main card */}
              <div
                className={`relative glass rounded-2xl ${
                  isMobile ? "p-4 sm:p-6" : "p-8"
                } backdrop-blur-xl`}
              >
                {/* Upload area - responsive aspect ratio */}
                <div
                  className={`${
                    isMobile ? "aspect-[4/3]" : "aspect-square"
                  } rounded-xl border-2 border-dashed border-primary/40 bg-background/10 flex flex-col items-center justify-center text-center ${
                    isMobile ? "p-4" : "p-8"
                  } hover:border-primary/60 transition-all duration-300 group cursor-pointer touch-manipulation`}
                >
                  <div className="floating-element mb-6">
                    <ImageIcon
                      className={`${
                        isMobile ? "w-12 h-12" : "w-16 h-16"
                      } text-primary/80 group-hover:text-primary transition-colors`}
                    />
                  </div>
                  <h3
                    className={`${
                      isMobile ? "text-lg" : "text-xl"
                    } font-semibold text-text mb-2`}
                  >
                    {isMobile ? "Tap to Upload" : "Drop Your Image"}
                  </h3>
                  <p
                    className={`text-text/60 mb-4 ${isMobile ? "text-sm" : ""}`}
                  >
                    {isMobile ? "or tap to browse" : "or click to browse"}
                  </p>
                  <div
                    className={`${
                      isMobile ? "text-xs" : "text-sm"
                    } text-text/50`}
                  >
                    JPEG, PNG, WebP supported
                  </div>
                </div>

                {/* Feature indicators - responsive grid */}
                <div
                  className={`grid grid-cols-3 ${
                    isMobile ? "gap-2 mt-4" : "gap-4 mt-6"
                  }`}
                >
                  <div
                    className={`flex flex-col items-center ${
                      isMobile ? "p-2" : "p-3"
                    } rounded-lg bg-primary/10 border border-primary/20`}
                  >
                    <Zap
                      className={`${
                        isMobile ? "w-4 h-4" : "w-5 h-5"
                      } text-primary mb-1`}
                    />
                    <span
                      className={`${
                        isMobile ? "text-xs" : "text-xs"
                      } text-text/70`}
                    >
                      Fast
                    </span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${
                      isMobile ? "p-2" : "p-3"
                    } rounded-lg bg-secondary/10 border border-secondary/20`}
                  >
                    <Shield
                      className={`${
                        isMobile ? "w-4 h-4" : "w-5 h-5"
                      } text-secondary mb-1`}
                    />
                    <span
                      className={`${
                        isMobile ? "text-xs" : "text-xs"
                      } text-text/70`}
                    >
                      Secure
                    </span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${
                      isMobile ? "p-2" : "p-3"
                    } rounded-lg bg-accent/10 border border-accent/20`}
                  >
                    <Download
                      className={`${
                        isMobile ? "w-4 h-4" : "w-5 h-5"
                      } text-accent mb-1`}
                    />
                    <span
                      className={`${
                        isMobile ? "text-xs" : "text-xs"
                      } text-text/70`}
                    >
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around the demo - hide on mobile to reduce clutter */}
            {!isMobile && (
              <>
                <div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full floating-element"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/30 rounded-full floating-element"
                  style={{ animationDelay: "3s" }}
                ></div>
                <div
                  className="absolute top-1/2 -right-8 w-4 h-4 bg-secondary/30 rounded-full floating-element"
                  style={{ animationDelay: "5s" }}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

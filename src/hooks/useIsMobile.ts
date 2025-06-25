import { useState, useEffect } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: "portrait" | "landscape";
  isTouchDevice: boolean;
}

export const useIsMobile = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    orientation: "landscape",
    isTouchDevice: false,
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Screen size based detection
      const isMobileBySize = width < 768;
      const isTabletBySize = width >= 768 && width < 1024;

      // User agent based detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent
        );
      const isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent);

      // Touch capability detection
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Combined detection (prefer user agent for accuracy)
      const isMobile = isMobileDevice || (isMobileBySize && !isTabletDevice);
      const isTablet = isTabletDevice || (isTabletBySize && !isMobileDevice);
      const isDesktop = !isMobile && !isTablet;

      // Orientation detection
      const orientation = height > width ? "portrait" : "landscape";

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        isTouchDevice,
      });
    };

    // Initial detection
    updateDetection();

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateDetection);
    window.addEventListener("orientationchange", updateDetection);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDetection);
      window.removeEventListener("orientationchange", updateDetection);
    };
  }, []);

  return detection;
};

// Utility functions for specific breakpoints
export const getBreakpoint = (
  width: number
): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" => {
  if (width < 480) return "xs";
  if (width < 640) return "sm";
  if (width < 768) return "md";
  if (width < 1024) return "lg";
  if (width < 1280) return "xl";
  return "2xl";
};

export const isMobileBreakpoint = (width: number): boolean => {
  return width < 768;
};

export const isTabletBreakpoint = (width: number): boolean => {
  return width >= 768 && width < 1024;
};

export const isDesktopBreakpoint = (width: number): boolean => {
  return width >= 1024;
};

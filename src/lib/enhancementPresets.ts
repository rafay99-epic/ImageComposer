export interface EnhancementSettings {
  sharpness: number;
  denoise: number;
  brightness: number;
  contrast: number;
  saturation: number;
  upscaleFactor: number;
}

export interface Preset {
  name: string;
  description: string;
  settings: EnhancementSettings;
  icon: string;
}

export const enhancementPresets: Preset[] = [
  {
    name: "Blur Fix",
    description: "Enhance blurry or out-of-focus images",
    icon: "🔍",
    settings: {
      sharpness: 80,
      denoise: 30,
      brightness: 105,
      contrast: 110,
      saturation: 100,
      upscaleFactor: 1,
    },
  },
  {
    name: "HDR Look",
    description: "Add depth and drama to your photos",
    icon: "✨",
    settings: {
      sharpness: 60,
      denoise: 20,
      brightness: 105,
      contrast: 120,
      saturation: 115,
      upscaleFactor: 1,
    },
  },
  {
    name: "Portrait",
    description: "Perfect for portrait photos",
    icon: "👤",
    settings: {
      sharpness: 40,
      denoise: 60,
      brightness: 102,
      contrast: 105,
      saturation: 95,
      upscaleFactor: 1,
    },
  },
  {
    name: "Text & Document",
    description: "Enhance text readability and document clarity",
    icon: "📄",
    settings: {
      sharpness: 90,
      denoise: 10,
      brightness: 110,
      contrast: 115,
      saturation: 90,
      upscaleFactor: 1.5,
    },
  },
  {
    name: "Night Scene",
    description: "Improve dark or night photos",
    icon: "🌙",
    settings: {
      sharpness: 50,
      denoise: 70,
      brightness: 120,
      contrast: 110,
      saturation: 105,
      upscaleFactor: 1,
    },
  },
  {
    name: "Old Photo",
    description: "Restore and enhance old photographs",
    icon: "🖼️",
    settings: {
      sharpness: 70,
      denoise: 50,
      brightness: 115,
      contrast: 115,
      saturation: 110,
      upscaleFactor: 2,
    },
  },
];

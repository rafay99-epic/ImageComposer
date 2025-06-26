import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  Search,
  ChevronRight,
  Image,
  FileImage,
  Sparkles,
  BookImage,
  Layers,
  Settings2,
  Palette,
  Upload,
  Monitor,
} from "lucide-react";
import DocViewer from "../components/DocViewer";
import { isFeatureEnabled, type FeatureFlags } from "../lib/featureFlags";

interface DocSection {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
  featureFlag?: keyof FeatureFlags;
}

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const sections: DocSection[] = [
    {
      id: "image-compression",
      title: "Image Compression",
      icon: <Image className="w-8 h-8" />,
      description: "Advanced image compression with quality preservation",
      featureFlag: "imageCompression" as keyof FeatureFlags,
    },
    {
      id: "svg-converter",
      title: "SVG Converter",
      icon: <FileImage className="w-8 h-8" />,
      description: "Convert raster images to scalable vector graphics",
      featureFlag: "svgConverter" as keyof FeatureFlags,
    },
    {
      id: "manual-enhancement",
      title: "Manual Enhancement",
      icon: <BookImage className="w-8 h-8" />,
      description: "Professional image enhancement tools",
      featureFlag: "manualEnhancement" as keyof FeatureFlags,
    },
    {
      id: "ai-enhancement",
      title: "AI Enhancement",
      icon: <Sparkles className="w-8 h-8" />,
      description: "AI-powered image enhancement and upscaling",
      featureFlag: "aiEnhancement" as keyof FeatureFlags,
    },
  ].filter(
    (section) =>
      !section.featureFlag ||
      isFeatureEnabled(section.featureFlag as keyof FeatureFlags)
  );

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If we have a feature parameter, show the documentation for that feature
  if (params.feature) {
    return <DocViewer feature={params.feature} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-text/80">
                Developer Documentation
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-6xl bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
              Technical Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-text/70">
              Comprehensive documentation for developers implementing and
              customizing features
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 bg-background/50 border border-primary/20 rounded-xl text-text focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(`/docs/${section.id}`)}
              className="text-left p-6 glass rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-primary">{section.icon}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-text group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-text/40 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="mt-2 text-text/70">{section.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;

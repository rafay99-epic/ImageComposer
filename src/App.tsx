import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isFeatureEnabled } from "./lib/featureFlags";

/* Route-level code splitting: load page chunks only when visited */
const Home = lazy(() => import("./pages/Home"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const SvgConverter = lazy(() => import("./pages/SvgConverter"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ImageComposer = lazy(() => import("./components/image-composer/ImageComposer"));
const ImageEnhancer = lazy(() => import("./components/image-enhancer/ImageEnhancer"));
const ManualEnhancer = lazy(() => import("./pages/ManualEnhancer"));
const Features = lazy(() => import("./components/Features"));
const Documentation = lazy(() => import("./pages/Documentation"));

const PageFallback = (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div
      className="size-10 rounded-full border-2 border-primary/30 border-t-primary motion-safe:animate-spin"
      aria-hidden
    />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={PageFallback}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features variant="page" />} />

          {/* Core Feature Routes */}
          {isFeatureEnabled("imageCompression") && (
            <Route path="/image-composer" element={<ImageComposer />} />
          )}
          {isFeatureEnabled("svgConverter") && (
            <Route path="/svg-converter" element={<SvgConverter />} />
          )}
          {isFeatureEnabled("manualEnhancement") && (
            <Route path="/manual-enhancer" element={<ManualEnhancer />} />
          )}
          {isFeatureEnabled("aiEnhancement") && (
            <Route path="/ai-enhancer" element={<ImageEnhancer />} />
          )}

          {/* Documentation Routes */}
          <Route path="/docs" element={<Documentation />} />
          <Route path="/docs/:feature" element={<Documentation />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

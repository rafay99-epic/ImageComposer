import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isFeatureEnabled } from "./lib/featureFlags";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import SvgConverter from "./pages/SvgConverter";
import NotFound from "./pages/NotFound";
import ImageComposer from "./components/image-composer/ImageComposer";
import ImageEnhancer from "./components/image-enhancer/ImageEnhancer";
import ManualEnhancer from "./pages/ManualEnhancer";
import Features from "./components/Features";
import Documentation from "./pages/Documentation";

const App: React.FC = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;

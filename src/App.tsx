import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Privacy />} />
        <Route path="/cookies" element={<Privacy />} />
      </Routes>
    </Router>
  );
};

export default App;

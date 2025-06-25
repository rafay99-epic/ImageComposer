import React from "react";
import Landing from "../components/Landing";
import Features from "../components/Features";
import ImageComposer from "../components/ImageComposer";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Landing />
        <Features />
        <ImageComposer />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

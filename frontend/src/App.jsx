import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import GraphSection from "./components/GraphSection";


function App() {
  return (

    <div className="bg-gradient-to-b from-blue-300 via-blue-200 to-white min-h-screen">
      <Navbar />
      <HeroSection />
      <GraphSection />
    </div>
  );
}

export default App;

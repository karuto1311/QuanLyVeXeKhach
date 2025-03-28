import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import LichSuMuaVe from "./Components/LichSuMuaVe";

function LichSuMuaVePage() {
  return (
    <div className="LichSuMuaVe">
      <Navbar />
      <LichSuMuaVe />
      <Footer />
    </div>
  );
}

export default LichSuMuaVePage;

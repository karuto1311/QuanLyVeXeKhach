import React from "react";
import NavbarAdmin from "./Components/NavbarAdmin";
import MainContent from "./Components/MainContent";
import Footer from "./Components/Footer";

function HomeAdmin() {
  return (
    <div className="Home">
      <NavbarAdmin />
      <MainContent />
      <Footer />
    </div>
  );
}

export default HomeAdmin;
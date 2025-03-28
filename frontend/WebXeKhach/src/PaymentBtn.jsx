import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PaymentBtn from "./Components/PaymentBtn";

function PaymentBtnPage() {
  return (
    <div className="PaymentBtn">
      <Navbar />
      <PaymentBtn />
      <Footer />
    </div>
  );
}

export default PaymentBtnPage;

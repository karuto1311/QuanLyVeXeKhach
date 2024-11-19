import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Payment from "./Components/Payment";

function PaymentPage() {
  return (
    <div className="Payment">
      <Navbar />
      <Payment />
      <Footer />
    </div>
  );
}

export default PaymentPage;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import Home from "./Home";
import Schedule from "./Schedule";
import About from "./About";
import Contact from "./Contact";
import Ticket from "./Ticket";
import News from "./News";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

import HomeAdmin from "./HomeAdmin";
import QlyBen from "./QlyBen";
import AddNewStation from "./AddNewStation";
import BusTicketSelection from "./BusTicketSelection";
import BusTicketForm from "./BusTicketForm";

import CRUDCustomer from "./backend/CRUDCustomer";
import CRUDEmployee from "./backend/CRUDEmployee";
import CRUDBusStation from "./backend/CRUDBusStation";
import CRUDBus from "./backend/CRUDBus";
import CRUDAccount from "./backend/CRUDAccount";
import CRUDBusTrip from "./backend/CRUDBusTrip";
import CRUDTripParticipants from "./backend/CRUDTripParticipants";
import CRUDTicket from "./backend/CRUDTicket";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/homeadmin" element={<HomeAdmin />} />
          <Route path="/busticketselection" element={<BusTicketSelection />} />
          <Route path="/busticketform" element={<BusTicketForm />} />

          <Route path="/qlyben" element={<QlyBen />} />
          <Route path="/addnewstation" element={<AddNewStation />} />
          {/*<Route path="/" element={<CRUDCustomer />} />
          <Route path="/" element={<CRUDEmployee />} />
          <Route path="/" element={<CRUDBusStation />} />
          <Route path="/" element={<CRUDBus />} />
          <Route path="/" element={<CRUDAccount />} />
          <Route path="/" element={<CRUDBusStation />} />
          <Route path="/" element={<CRUDTripParticipants />} />
          <Route path="/" element={<CRUDTicket />} />*/}

          {/*<Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

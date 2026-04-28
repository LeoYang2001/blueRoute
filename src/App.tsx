import "./css/App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Career from "./pages/Career";
import { DelayedRoutes } from "./pages/DelayedRoutes";
import FleetInfo from "./pages/FleetInfo";
import Business from "./pages/Business";
import SafetySustainability from "./pages/SafetySustainability";
import ContactModal from "./components/ContactModal";
import { ContactContext } from "./components/ContactContext";

function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <BrowserRouter>
      <ContactContext.Provider value={() => setContactOpen(true)}>
        <div className="w-full">
          <ContactModal
            isOpen={contactOpen}
            onClose={() => setContactOpen(false)}
          />
          <DelayedRoutes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet-info" element={<FleetInfo />} />
            <Route path="/business" element={<Business />} />
            <Route
              path="/safety-sustainability"
              element={<SafetySustainability />}
            />
          </DelayedRoutes>
        </div>
      </ContactContext.Provider>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import { DelayedRoutes } from "./pages/DelayedRoutes";
import FleetInfo from "./pages/FleetInfo";
import Business from "./pages/Business";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full">
        <DelayedRoutes>
          <Route path="/" element={<Home />} />
          <Route path="/fleet-info" element={<FleetInfo />} />
          <Route path="/business" element={<Business />} />

          <Route path="/about" element={<About />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
        </DelayedRoutes>
      </div>
    </BrowserRouter>
  );
}

export default App;

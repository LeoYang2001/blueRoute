import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Career from "./pages/Career";
import News from "./pages/News";
import Contact from "./pages/Contact";
import { DelayedRoutes } from "./pages/DelayedRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full">
        <DelayedRoutes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/career" element={<Career />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
        </DelayedRoutes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { NavLink } from "react-router-dom";
import "../css/Navbar.css";
import { useContact } from "./ContactContext";
import AnimatedBrandLogo from "./brand/AnimatedBrandLogo";

type NavbarProps = {
  isCollapsed?: boolean;
  onContactOpen?: () => void;
};

export default function Navbar({ isCollapsed = false }: NavbarProps) {
  const openContact = useContact();
  return (
    <header
      className={`navbarShell  ${isCollapsed ? "navbarShell--collapsed" : ""}`}
    >
      <div className="navbarPanel">
        <div className="navbarCompactTrigger " aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="navbarBrand" aria-label="BlueRoute logo">
          <img
            className="navbarBrandLogo"
            src="/logo/logo.png"
            alt="BlueRoute logo"
          />
        </div>

        <nav className="main-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/fleet-info"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Fleet Info
          </NavLink>
          <NavLink
            to="/business"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Business
          </NavLink>
          <NavLink
            to="/safety-sustainability"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Safety & Sustainability
          </NavLink>
        </nav>

        <button className="navbarContactButton" onClick={openContact}>
          Get in touch
        </button>
      </div>
    </header>
  );
}

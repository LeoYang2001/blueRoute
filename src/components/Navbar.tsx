import { NavLink } from "react-router-dom";
import "./Navbar.css";

type NavbarProps = {
  isCollapsed?: boolean;
};

export default function Navbar({ isCollapsed = false }: NavbarProps) {
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

        <div className="branding">BlueRoute</div>

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
            to="/technology"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Technology
          </NavLink>
          <NavLink
            to="/career"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Career
          </NavLink>
        </nav>

        <NavLink to="/contact" className="navbarContactButton">
          Get in touch
        </NavLink>
      </div>
    </header>
  );
}

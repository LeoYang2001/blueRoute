import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css";
import { useContact } from "./ContactContext";

type NavbarProps = {
  isCollapsed?: boolean;
  onContactOpen?: () => void;
};

export default function Navbar({ isCollapsed = false }: NavbarProps) {
  const openContact = useContact();
  // Mobile drawer toggle — desktop ignores this state because the mobile
  // header/drawer markup is hidden by CSS above 768px.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Defensive cleanup on mount — clears any inline `body.style.overflow`
  // that a previous Navbar instance might have left locked (e.g. user
  // navigated between pages while the drawer was open, or React strict-mode
  // double-mounts mid-toggle). Without this, the page can ship with a
  // hidden overflow that breaks scrolling and obscures the navbar.
  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  // Lock body scroll while the mobile drawer is open so the page underneath
  // doesn't scroll under the overlay.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop pill navbar — unchanged from the laptop design. CSS hides
          this on mobile (<768px). */}
      <header
        className={`navbarShell ${isCollapsed ? "navbarShell--collapsed" : ""}`}
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

      {/* Mobile header bar: compact pill with logo + hamburger. Visible only
          below 768px (CSS-gated via `.navbarMobile`). */}
      <header className="navbarMobile">
        <div className="navbarMobile__bar">
          <div
            className="navbarMobile__brand"
            aria-label="BlueRoute logo"
          >
            <img src="/logo/logo.png" alt="BlueRoute logo" />
          </div>
          <button
            type="button"
            className={`navbarMobile__toggle ${mobileOpen ? "is-open" : ""}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile drawer — staggered 3×3 grid of nav cells with an X close button
          top-right and a full-width "Get in touch" CTA at the bottom. Empty
          cells in the grid create the negative-space checkerboard look. */}
      <div
        className={`navbarMobileDrawer ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="navbarMobileDrawer__close"
          aria-label="Close menu"
          onClick={closeMobile}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
        </button>

        <nav className="navbarMobileDrawer__grid" aria-label="Primary">
          {/* Row 1 */}
          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) =>
              `navbarMobileDrawer__cell${isActive ? " is-active" : ""}`
            }
          >
            <span>Home.</span>
          </NavLink>
          <span
            className="navbarMobileDrawer__cell navbarMobileDrawer__cell--empty"
            aria-hidden="true"
          />
          <NavLink
            to="/fleet-info"
            onClick={closeMobile}
            className={({ isActive }) =>
              `navbarMobileDrawer__cell${isActive ? " is-active" : ""}`
            }
          >
            <span>Fleet Info.</span>
          </NavLink>

          {/* Row 2 */}
          <span
            className="navbarMobileDrawer__cell navbarMobileDrawer__cell--empty"
            aria-hidden="true"
          />
          <NavLink
            to="/business"
            onClick={closeMobile}
            className={({ isActive }) =>
              `navbarMobileDrawer__cell${isActive ? " is-active" : ""}`
            }
          >
            <span>Business.</span>
          </NavLink>
          <span
            className="navbarMobileDrawer__cell navbarMobileDrawer__cell--empty"
            aria-hidden="true"
          />

          {/* Row 3 */}
          <NavLink
            to="/safety-sustainability"
            onClick={closeMobile}
            className={({ isActive }) =>
              `navbarMobileDrawer__cell navbarMobileDrawer__cell--wide${
                isActive ? " is-active" : ""
              }`
            }
          >
            <span>
              Safety &amp;
              <br />
              Sustainability.
            </span>
          </NavLink>
          <span
            className="navbarMobileDrawer__cell navbarMobileDrawer__cell--empty"
            aria-hidden="true"
          />
          <span
            className="navbarMobileDrawer__cell navbarMobileDrawer__cell--empty"
            aria-hidden="true"
          />
        </nav>

        <button
          className="navbarMobileDrawer__cta"
          onClick={() => {
            closeMobile();
            openContact();
          }}
        >
          <span>Get in touch</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </button>
      </div>
    </>
  );
}

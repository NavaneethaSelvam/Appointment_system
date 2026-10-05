import {
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppointmentEntry from "./pages/AppointmentEntry";
import AppointmentList from "./pages/AppointmentList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

import "./App.css";


function App() {
  return (
    <div className="app">

      <Routes>

        {/* =================================================
            USER HOME PAGE
            ================================================= */}

        <Route
          path="/"
          element={
            <UserLayout>
              <AppointmentEntry />
            </UserLayout>
          }
        />


        {/* =================================================
            USER APPOINTMENTS PAGE
            ================================================= */}

        <Route
          path="/appointments"
          element={
            <UserLayout>
              <AppointmentList />
            </UserLayout>
          }
        />


        {/* =================================================
            ADMIN LOGIN
            NO USER NAVBAR
            NO USER FOOTER
            ================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* =================================================
            ADMIN DASHBOARD
            NO USER NAVBAR
            NO USER FOOTER
            ================================================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* =================================================
            UNKNOWN URL
            ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </div>
  );
}


/* =========================================================
   USER LAYOUT
   Navbar + Page + Footer
   ========================================================= */

function UserLayout({ children }) {
  return (
    <>

      <Navigation />

      <main className="user-page-content">
        {children}
      </main>

      <Footer />

    </>
  );
}


/* =========================================================
   USER NAVIGATION
   ========================================================= */

function Navigation() {
  return (
    <header className="app-header">

      <div className="nav-container">

        {/* =================================================
            BRAND
            ================================================= */}

        <div className="brand">

          <div className="brand-icon">
            <span>📅</span>
          </div>

          <div className="brand-text">

            <h2>
              AppointEase
            </h2>

            <div className="brand-color-line">
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

        </div>


        {/* =================================================
            NAVIGATION LINKS
            ================================================= */}

        <nav className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >

            <span className="nav-link-icon">
              ＋
            </span>

            <span>
              New Appointment
            </span>

          </NavLink>


          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >

            <span className="nav-link-icon">
              ▣
            </span>

            <span>
              Appointments
            </span>

          </NavLink>

        </nav>

      </div>


      {/* =================================================
          THREE COLOR LINE
          ================================================= */}

      <div className="header-color-line">

        <span className="color-purple"></span>

        <span className="color-cyan"></span>

        <span className="color-violet"></span>

      </div>

    </header>
  );
}


/* =========================================================
   USER FOOTER
   ========================================================= */

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <p>
          © 2026{" "}
          <strong>
            AppointEase
          </strong>

          {" • "}

          Simple Appointment Record System
        </p>

        <span className="footer-tagline">
          Secure • Simple • Smart
        </span>

      </div>

    </footer>
  );
}


export default App;
import { NavLink, Route, Routes } from "react-router-dom";
import AppointmentEntry from "./pages/AppointmentEntry";
import AppointmentList from "./pages/AppointmentList";
import "./App.css";

function App() {
  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">

        <div className="nav-container">

          <div className="brand">
            <div className="brand-icon">📅</div>

            <div>
              <h2>AppointEase</h2>
              <span>Appointment Management</span>
            </div>
          </div>

          <div className="nav-links">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>＋</span>
              New Appointment
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>▣</span>
              Appointments
            </NavLink>

          </div>

        </div>

      </nav>


      {/* Pages */}
      <Routes>

        <Route
          path="/"
          element={<AppointmentEntry />}
        />

        <Route
          path="/appointments"
          element={<AppointmentList />}
        />

      </Routes>


      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AppointEase • Simple Appointment Record System</p>
      </footer>

    </div>
  );
}

export default App;
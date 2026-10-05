
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/admin/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("Admin login response:", response.data);

      // ==========================================
      // CHECK ADMIN ROLE
      // ==========================================

      if (response.data.role !== "admin") {
        alert("You do not have admin access.");
        return;
      }

      // ==========================================
      // SAVE ADMIN TOKEN
      // IMPORTANT:
      // Dashboard also uses "admin_token"
      // ==========================================

      localStorage.setItem(
        "admin_token",
        response.data.access_token
      );

      // ==========================================
      // SAVE ADMIN DETAILS
      // ==========================================

      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          user_id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        })
      );

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      alert("Admin login successful!");

      navigate("/admin");

    } catch (error) {
      console.error("Admin login error:", error);
      console.error(
        "Backend response:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        alert("Invalid admin email or password.");
      } else if (error.response?.status === 403) {
        alert("Admin access required.");
      } else {
        alert(
          error.response?.data?.detail ||
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="admin-login-page">

      {/* Background decorations */}

      <div className="admin-bg-circle circle-one"></div>
      <div className="admin-bg-circle circle-two"></div>
      <div className="admin-bg-circle circle-three"></div>


      <section className="admin-login-wrapper">

        {/* ======================================
            LEFT SIDE
        ====================================== */}

        <div className="admin-login-info">

          <div className="admin-brand">

            <div className="admin-brand-icon">
              📅
            </div>

            <div>
              <h2>AppointEase</h2>

              <div className="admin-brand-line">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

          </div>


          <span className="admin-badge">
            🔐 ADMIN PORTAL
          </span>


          <h1>
            Welcome Back,
            <span> Administrator</span>
          </h1>


          <p>
            Manage appointments, monitor records and
            keep your appointment system organized
            from one secure dashboard.
          </p>


          <div className="admin-features">

            {/* Feature 1 */}

            <div className="admin-feature">

              <div className="feature-icon">
                📋
              </div>

              <div>
                <strong>
                  Manage Records
                </strong>

                <small>
                  View all appointment applications
                </small>
              </div>

            </div>


            {/* Feature 2 */}

            <div className="admin-feature">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Update Status
                </strong>

                <small>
                  Confirm or complete appointments
                </small>
              </div>

            </div>


            {/* Feature 3 */}

            <div className="admin-feature">

              <div className="feature-icon">
                🛡️
              </div>

              <div>
                <strong>
                  Secure Access
                </strong>

                <small>
                  Admin-only dashboard access
                </small>
              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <div className="admin-login-card">

          <div className="admin-card-icon">
            🔐
          </div>


          <div className="admin-card-heading">

            <span>
              ADMIN ACCESS
            </span>

            <h2>
              Sign in to Dashboard
            </h2>

            <p>
              Enter your administrator credentials
              to continue.
            </p>

          </div>


          {/* ====================================
              LOGIN FORM
          ==================================== */}

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="admin-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="admin-input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="admin-btn-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* SECURITY NOTE */}

          <div className="admin-security-note">

            <span>
              🛡️
            </span>

            <p>
              This area is restricted to authorized
              administrators only.
            </p>

          </div>


          {/* BACK BUTTON */}

          <button
            className="back-user-btn"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Back to AppointEase
          </button>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="admin-login-footer">

        © 2026 <strong>AppointEase</strong>
        {" • "}
        Admin Management Portal

      </footer>

    </main>
  );
}

export default AdminLogin;

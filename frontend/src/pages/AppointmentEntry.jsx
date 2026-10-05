import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AppointmentEntry.css";

const API_URL = "http://127.0.0.1:8000";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  time: "",
};

function AppointmentEntry() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // CREATE APPOINTMENT
      // NO USER LOGIN REQUIRED
      // ========================================

      const response = await axios.post(
        `${API_URL}/api/appointments`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          date: form.date,
          time: form.time,
        }
      );

      console.log("Appointment created:", response.data);

      alert("Appointment booked successfully!");

      // Clear form
      setForm(emptyForm);

      // Go to appointment records
      navigate("/appointments");

    } catch (error) {
      console.error(
        "Appointment booking error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      // ========================================
      // 422 VALIDATION ERROR
      // ========================================

      if (error.response?.status === 422) {
        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          const messages = detail
            .map((item) => {
              const field =
                item.loc?.[item.loc.length - 1];

              return `${field}: ${item.msg}`;
            })
            .join("\n");

          alert(
            `Please check the following fields:\n\n${messages}`
          );
        } else {
          alert(
            "Please check all appointment details."
          );
        }

        return;
      }

      // ========================================
      // OTHER ERRORS
      // ========================================

      alert(
        error.response?.data?.detail ||
          "Unable to book appointment. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="appointment-page">

      {/* ==========================================
          HERO SECTION
      ========================================== */}

      <section className="hero-section">

        <div className="hero-background-circle circle-one"></div>
        <div className="hero-background-circle circle-two"></div>
        <div className="hero-background-circle circle-three"></div>

        <div className="hero-content">

          <div className="hero-text">

            <span className="welcome-badge">
              ✨ Easy & Simple Booking
            </span>

            <h1>
              Schedule Your
              <span> Appointment</span>
            </h1>

            <p>
              Book your appointment quickly and easily.
              Enter your details and choose your preferred
              date and time.
            </p>

            <div className="hero-features">

              <div>
                <span>✓</span>
                Easy Booking
              </div>

              <div>
                <span>✓</span>
                Quick Management
              </div>

              <div>
                <span>✓</span>
                Secure Records
              </div>

            </div>

          </div>

          {/* FLOATING CALENDAR */}

          <div className="floating-calendar">

            <div className="calendar-top">
              <span>APPOINTMENT</span>

              <span className="calendar-icon">
                📅
              </span>
            </div>

            <div className="calendar-date">

              <strong>24</strong>

              <div>
                <b>Available</b>
                <small>Book your slot</small>
              </div>

            </div>

            <div className="calendar-dots">
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div className="calendar-mini-row">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
            </div>

          </div>

        </div>

      </section>


      {/* ==========================================
          FORM SECTION
      ========================================== */}

      <section className="form-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              APPOINTMENT ENTRY
            </span>

            <h2>
              Book a New Appointment
            </h2>

            <p>
              Fill in the information below to create
              your appointment record.
            </p>

          </div>

          <div className="heading-icon">
            🗓️
          </div>

        </div>


        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            {/* NAME */}

            <div className="input-box">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="input-box">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="input-box">

              <label>
                Phone Number
              </label>

              <div className="input-wrapper">

                <span>📱</span>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

            </div>


            {/* SERVICE */}

            <div className="input-box">

              <label>
                Select Service
              </label>

              <div className="input-wrapper">

                <span>🩺</span>

                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                >

                  <option value="">
                    Select a service
                  </option>

                  <option value="General Consultation">
                    General Consultation
                  </option>

                  <option value="Dental Consultation">
                    Dental Consultation
                  </option>

                  <option value="Health Checkup">
                    Health Checkup
                  </option>

                  <option value="Follow-up Consultation">
                    Follow-up Consultation
                  </option>

                  <option value="Other Service">
                    Other Service
                  </option>

                </select>

              </div>

            </div>


            {/* DATE */}

            <div className="input-box">

              <label>
                Appointment Date
              </label>

              <div className="input-wrapper">

                <span>📅</span>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* TIME */}

            <div className="input-box">

              <label>
                Appointment Time
              </label>

              <div className="input-wrapper">

                <span>⏰</span>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* ======================================
              FORM FOOTER
          ====================================== */}

          <div className="form-footer">

            <p className="privacy-text">
              🔒 Your appointment information is
              securely recorded.
            </p>

            <button
              type="submit"
              className="book-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Booking...
                </>
              ) : (
                <>
                  Book Appointment
                  <span>→</span>
                </>
              )}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default AppointmentEntry;
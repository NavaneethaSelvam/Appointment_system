import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/appointments/";

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
  const location = useLocation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
    If Edit button sends appointment data,
    automatically fill the form.
  */
  useEffect(() => {
    if (location.state?.appointment) {
      const appointment = location.state.appointment;

      setEditingId(appointment.id);

      setForm({
        name: appointment.name || "",
        email: appointment.email || "",
        phone: appointment.phone || "",
        service: appointment.service || "",
        date: appointment.date || "",
        time: appointment.time || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}${editingId}/`, {
          ...form,
          status: "Pending",
        });

        alert("Appointment updated successfully!");
      } else {
        // CREATE
        await axios.post(API_URL, {
          ...form,
          status: "Pending",
        });

        alert("Appointment booked successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);

      navigate("/appointments");

    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong. Please make sure Django server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    navigate("/appointments");
  };

  return (
    <main className="page">

      {/* Hero */}

      <div className="hero-section">

        <div className="hero-content">

          <div className="hero-text">

            <span className="welcome-badge">
              ✨ Easy & Simple Booking
            </span>

            <h1>
              {editingId ? (
                <>
                  Update Your
                  <span> Appointment</span>
                </>
              ) : (
                <>
                  Schedule Your
                  <span> Appointment</span>
                </>
              )}
            </h1>

            <p>
              {editingId
                ? "Update your appointment details quickly and easily."
                : "Book your appointment quickly and easily. Enter your details and choose your preferred date and time."}
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

          <div className="floating-calendar">

            <div className="calendar-top">
              <span>
                {editingId ? "UPDATE" : "APPOINTMENT"}
              </span>

              <span style={{ fontSize: "1.2rem" }}>📅</span>
            </div>

            <div className="calendar-date">
              <strong>24</strong>

              <div>
                <b>
                  {editingId ? "Edit" : "Available"}
                </b>

                <small>
                  {editingId
                    ? "Update your slot"
                    : "Book your slot"}
                </small>
              </div>
            </div>

            <div className="calendar-dots">
              <i></i>
              <i></i>
              <i></i>
            </div>

          </div>

        </div>

      </div>


      {/* Form */}

      <section className="form-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              {editingId
                ? "APPOINTMENT UPDATE"
                : "APPOINTMENT ENTRY"}
            </span>

            <h2>
              {editingId
                ? "Update Appointment"
                : "Book a New Appointment"}
            </h2>

            <p>
              {editingId
                ? "Modify the appointment information below."
                : "Fill in the information below to create your appointment record."}
            </p>

          </div>

          <div className="heading-icon"
           style={{ fontSize: "2.5rem" }}>
            🗓️
          </div>

        </div>


        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            {/* Name */}

            <div className="input-box">

              <label>Full Name</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.2rem" }}>👤</span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

              </div>

            </div>


            {/* Email */}

            <div className="input-box">

              <label>Email Address</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.2rem" }}>✉️</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />

              </div>

            </div>


            {/* Phone */}

            <div className="input-box">

              <label>Phone Number</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.2rem" }}>📱</span>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

            </div>


            {/* Service */}

            <div className="input-box">

              <label>Select Service</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.5rem" }}>🩺</span>

                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                >

                  <option value="">
                    Choose a service
                  </option>

                  <option value="General Consultation">
                    General Consultation
                  </option>

                  <option value="Health Checkup">
                    Health Checkup
                  </option>

                  <option value="Dental Consultation">
                    Dental Consultation
                  </option>

                  <option value="Eye Checkup">
                    Eye Checkup
                  </option>

                  <option value="Follow-up">
                    Follow-up
                  </option>

                </select>

              </div>

            </div>


            {/* Date */}

            <div className="input-box">

              <label>Appointment Date</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.2rem" }}>📅</span>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* Time */}

            <div className="input-box">

              <label>Appointment Time</label>

              <div className="input-wrapper">

                <span style={{ fontSize: "1.2rem" }}>⏰</span>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          <div className="form-footer">

            <div className="privacy-text">
              🔒 Your appointment information is securely stored.
            </div>

            <div className="form-action-buttons">

              {editingId && (
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="book-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {editingId
                      ? "Updating..."
                      : "Booking..."}
                  </>
                ) : (
                  <>
                    {editingId
                      ? "Update Appointment"
                      : "Book Appointment"}

                    <span>→</span>
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </section>

    </main>
  );
}

export default AppointmentEntry;
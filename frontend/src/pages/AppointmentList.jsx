import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/appointments/";

function AppointmentList() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(API_URL);

      setAppointments(response.data);
    } catch (error) {
      console.error(error);

      alert("Unable to connect to Django backend.");
    } finally {
      setLoading(false);
    }
  };

  // Load appointments when page opens
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Delete appointment
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}${id}/`);

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment.id !== id
        )
      );

      alert("Appointment deleted successfully!");
    } catch (error) {
      console.error(error);

      alert("Unable to delete appointment.");
    }
  };

  // Change appointment status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API_URL}${id}/`, {
        status: status,
      });

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: status,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(error);

      alert("Unable to update status.");
    }
  };

  // Convert backend time into AM/PM format
  // Example: 10:30:00 -> 10:30 AM
  // Example: 14:30:00 -> 2:30 PM
  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Appointment statistics
  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  return (
    <main className="list-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <section className="list-hero">

        <div>
          <span className="section-label">
            APPOINTMENT MANAGEMENT
          </span>

          <h1>
            Manage Your
            <span> Appointments</span>
          </h1>

          <p>
            View, update and manage all your appointment
            records from one place.
          </p>
        </div>

        <button
          className="new-appointment-btn"
          onClick={() => navigate("/")}
        >
          ＋ New Appointment
        </button>

      </section>


      {/* =========================
          STATISTICS
      ========================== */}

      <section className="management-stats">

        {/* Total */}
        <div className="management-card">

          <div className="management-icon total">
            📋
          </div>

          <div>
            <span>Total</span>

            <strong>
              {appointments.length}
            </strong>
          </div>

        </div>


        {/* Pending */}
        <div className="management-card">

          <div className="management-icon pending">
            ⏳
          </div>

          <div>
            <span>Pending</span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        {/* Confirmed */}
        <div className="management-card">

          <div className="management-icon confirmed">
            ✓
          </div>

          <div>
            <span>Confirmed</span>

            <strong>
              {confirmedCount}
            </strong>
          </div>

        </div>


        {/* Completed */}
        <div className="management-card">

          <div className="management-icon completed">
            ★
          </div>

          <div>
            <span>Completed</span>

            <strong>
              {completedCount}
            </strong>
          </div>

        </div>


        {/* Cancelled */}
        <div className="management-card">

          <div className="management-icon cancelled">
            ×
          </div>

          <div>
            <span>Cancelled</span>

            <strong>
              {cancelledCount}
            </strong>
          </div>

        </div>

      </section>


      {/* =========================
          APPOINTMENT RECORDS
      ========================== */}

      <section className="appointments-card">

        {/* Table Header */}
        <div className="appointments-header">

          <div>

            <h2>
              Appointment Records
            </h2>

            <p>
              All saved appointment records are displayed below.
            </p>

          </div>

          <div className="record-count">
            {appointments.length} Records
          </div>

        </div>


        {/* =========================
            LOADING
        ========================== */}

        {loading ? (

          <div className="loading-state">

            <div className="large-spinner"></div>

            <p>
              Loading appointments...
            </p>

          </div>


        ) : appointments.length === 0 ? (


          /* =========================
              EMPTY STATE
          ========================== */

          <div className="empty-list">

            <div className="empty-animation">
              📅
            </div>

            <h3>
              No Appointments Found
            </h3>

            <p>
              You haven't created any appointment records yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="book-first-btn"
            >
              Book Your First Appointment
            </button>

          </div>


        ) : (


          /* =========================
              APPOINTMENT TABLE
          ========================== */

          <div className="table-scroll">

            <table className="appointment-table">

              <thead>

                <tr>

                  <th>
                    Patient
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Service
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {appointments.map((appointment) => (

                  <tr key={appointment.id}>


                    {/* =========================
                        PATIENT
                    ========================== */}

                    <td>

                      <div className="patient-cell">

                        <div className="patient-avatar">

                          {appointment.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {appointment.name}
                          </strong>

                          <small>
                            ID #{appointment.id}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* =========================
                        CONTACT
                    ========================== */}

                    <td>

                      <div className="contact-cell">

                        <span>
                          {appointment.email}
                        </span>

                        <small>
                          {appointment.phone}
                        </small>

                      </div>

                    </td>


                    {/* =========================
                        SERVICE
                    ========================== */}

                    <td>

                      <span className="service-badge">
                        {appointment.service}
                      </span>

                    </td>


                    {/* =========================
                        DATE
                    ========================== */}

                    <td>

                      <div className="date-cell">
                        📅 {appointment.date}
                      </div>

                    </td>


                    {/* =========================
                        TIME
                    ========================== */}

                    <td>

                      <div className="time-cell">
                        ⏰ {formatTime(appointment.time)}
                      </div>

                    </td>


                    {/* =========================
                        STATUS
                    ========================== */}

                    <td>

                      <select
                        className={`status-dropdown ${
                          appointment.status
                            ?.toLowerCase()
                        }`}
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            appointment.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    {/* =========================
                        ACTIONS
                    ========================== */}

                    <td>

                      <div className="action-buttons">


                        {/* EDIT BUTTON */}

                        <button
                          className="action edit"
                          title="Edit appointment"
                          onClick={() =>
                            navigate("/", {
                              state: {
                                appointment: appointment,
                              },
                            })
                          }
                        >
                          ✏️
                        </button>


                        {/* DELETE BUTTON */}

                        <button
                          className="action delete"
                          title="Delete appointment"
                          onClick={() =>
                            handleDelete(
                              appointment.id
                            )
                          }
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AppointmentList;
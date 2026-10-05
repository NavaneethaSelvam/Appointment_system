import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:8000";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const getAdminToken = () => {
    return localStorage.getItem("admin_token");
  };

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        setError("Admin session not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!Array.isArray(response.data)) {
        setError("Invalid appointment data received from server.");
        return;
      }

      setAppointments(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Admin appointment error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have admin access.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load appointments."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  const acceptedCount = appointments.filter(
    (item) => item.status === "Accepted"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(
    appointments.length / recordsPerPage
  );

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const endIndex =
    startIndex + recordsPerPage;

  const currentAppointments =
    appointments.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      document
        .getElementById("appointments-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const handleStatusChange = async (
    appointmentId,
    newStatus
  ) => {
    try {
      const token = getAdminToken();

      if (!token) {
        alert("Admin session expired. Please login again.");
        return;
      }

      setUpdatingId(appointmentId);

      await axios.put(
        `${API_URL}/api/admin/appointments/${appointmentId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: newStatus,
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to update appointment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "-";

    try {
      const [hours, minutes] = time.split(":");

      const date = new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    try {
      const date = new Date(
        `${dateValue}T00:00:00`
      );

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateValue;
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (!status) return "pending";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // USER CLICK
  // =====================================================

  const handleUserClick = (userId) => {
    localStorage.setItem(
      "selected_user_id",
      String(userId)
    );

    window.location.href = "/appointments";
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_role");

    window.location.href = "/admin-login";
  };

  // =====================================================
  // LOGIN AGAIN
  // =====================================================

  const handleLoginAgain = () => {
    window.location.href = "/admin-login";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <div className="logo-icon">A</div>

            <div className="logo-text">
              <h2>AppointEase</h2>
              <span>Admin Panel</span>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-loading-card">
            <div className="loader"></div>

            <h3>Loading appointments...</h3>

            <p>
              Please wait while we fetch the records.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <div className="logo-icon">
            A
          </div>

          <div className="logo-text">
            <h2>AppointEase</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button
            type="button"
            className="nav-item active"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              document
                .getElementById(
                  "appointments-section"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <span className="nav-icon">◷</span>
            <span>Appointments</span>
          </button>

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              alert(
                "Users section is available through the appointment records."
              )
            }
          >
            <span className="nav-icon">♙</span>
            <span>Users</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile">
            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <strong>Administrator</strong>
              <small>Admin</small>
            </div>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div className="header-content">

            <span className="admin-label">
              APPOINTEASE ADMIN
            </span>

            <h1>Dashboard</h1>

            <p>
              Manage appointments and monitor
              your users.
            </p>

          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={fetchAppointments}
          >
            <span>↻</span>
            Refresh
          </button>

        </header>

        {/* ERROR */}

        {error && (
          <section className="error-card">

            <div className="error-icon">
              !
            </div>

            <div>
              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>
            </div>

            <div className="error-actions">

              <button
                type="button"
                className="retry-btn"
                onClick={fetchAppointments}
              >
                ↻ Try Again
              </button>

              <button
                type="button"
                className="login-again-btn"
                onClick={handleLoginAgain}
              >
                Admin Login
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        {!error && (
          <section className="stats-grid">

            {/* TOTAL */}

            <div className="stat-card total-card">

              <div className="stat-icon">
                ▦
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  Total Appointments
                </span>

                <strong className="stat-number">
                  {appointments.length}
                </strong>

                <span className="stat-description">
                  All records
                </span>
              </div>

            </div>

            {/* PENDING */}

            <div className="stat-card pending-card">

              <div className="stat-icon">
                ◷
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  Pending
                </span>

                <strong className="stat-number">
                  {pendingCount}
                </strong>

                <span className="stat-description">
                  Waiting for action
                </span>
              </div>

            </div>

            {/* ACCEPTED */}

            <div className="stat-card accepted-card">

              <div className="stat-icon">
                ✓
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  Accepted
                </span>

                <strong className="stat-number">
                  {acceptedCount}
                </strong>

                <span className="stat-description">
                  Approved appointments
                </span>
              </div>

            </div>

            {/* COMPLETED */}

            <div className="stat-card completed-card">

              <div className="stat-icon">
                ★
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  Completed
                </span>

                <strong className="stat-number">
                  {completedCount}
                </strong>

                <span className="stat-description">
                  Finished appointments
                </span>
              </div>

            </div>

            {/* CANCELLED */}

            <div className="stat-card cancelled-card">

              <div className="stat-icon">
                ×
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  Cancelled
                </span>

                <strong className="stat-number">
                  {cancelledCount}
                </strong>

                <span className="stat-description">
                  Cancelled records
                </span>
              </div>

            </div>

          </section>
        )}

        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        {!error && (
          <section
            className="appointments-card"
            id="appointments-section"
          >

            <div className="section-header">

              <div>
                <span className="section-mini-label">
                  RECORD MANAGEMENT
                </span>

                <h2>
                  All Appointments
                </h2>

                <p>
                  View and manage all user
                  appointment requests.
                </p>
              </div>

              <div className="appointment-count">
                {appointments.length} Records
              </div>

            </div>

            {appointments.length === 0 ? (

              <div className="state-message">

                <div className="empty-icon">
                  ▦
                </div>

                <h3>
                  No appointments yet
                </h3>

                <p>
                  User appointments will
                  appear here.
                </p>

              </div>

            ) : (

              <>

                {/* TABLE */}

                <div className="table-wrapper">

                  <table className="appointments-table">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {currentAppointments.map(
                        (appointment, index) => (

                          <tr
                            key={appointment.id}
                            className="appointment-row"
                            style={{
                              animationDelay:
                                `${index * 0.04}s`,
                            }}
                          >

                            {/* ID */}

                            <td>
                              <span className="appointment-id">
                                #
                                {String(
                                  appointment.id
                                ).slice(0, 8)}
                              </span>
                            </td>

                            {/* USER */}

                            <td>

                              <button
                                type="button"
                                className="user-cell"
                                onClick={() =>
                                  handleUserClick(
                                    appointment.user_id
                                  )
                                }
                              >

                                <div className="user-avatar">
                                  {appointment.name
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "U"}
                                </div>

                                <div className="user-details">

                                  <strong>
                                    {appointment.name ||
                                      "Unknown User"}
                                  </strong>

                                  <small>
                                    User ID #
                                    {appointment.user_id}
                                  </small>

                                </div>

                              </button>

                            </td>

                            {/* EMAIL */}

                            <td className="email-cell">
                              {appointment.email || "-"}
                            </td>

                            {/* PHONE */}

                            <td className="phone-cell">
                              {appointment.phone || "-"}
                            </td>

                            {/* SERVICE */}

                            <td>
                              <span className="service-badge">
                                {appointment.service ||
                                  "Appointment"}
                              </span>
                            </td>

                            {/* DATE */}

                            <td>
                              <span className="date-value">
                                <span>📅</span>
                                {formatDate(
                                  appointment.date
                                )}
                              </span>
                            </td>

                            {/* TIME */}

                            <td>
                              <span className="time-value">
                                <span>⏰</span>
                                {formatTime(
                                  appointment.time
                                )}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td>

                              <div className="status-control">

                                <select
                                  className={`status-dropdown ${getStatusClass(
                                    appointment.status
                                  )}`}
                                  value={
                                    appointment.status ||
                                    "Pending"
                                  }
                                  disabled={
                                    updatingId ===
                                    appointment.id
                                  }
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

                                  <option value="Accepted">
                                    Accepted
                                  </option>

                                  <option value="Completed">
                                    Completed
                                  </option>

                                  <option value="Cancelled">
                                    Cancelled
                                  </option>

                                </select>

                                {updatingId ===
                                  appointment.id && (
                                  <span className="status-saving">
                                    Saving...
                                  </span>
                                )}

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 1 && (

                  <div className="pagination">

                    <button
                      type="button"
                      className="page-btn prev-next"
                      disabled={currentPage === 1}
                      onClick={() =>
                        goToPage(currentPage - 1)
                      }
                    >
                      ← Previous
                    </button>

                    <div className="page-numbers">

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (

                        <button
                          type="button"
                          key={page}
                          className={`page-btn ${
                            currentPage === page
                              ? "active-page"
                              : ""
                          }`}
                          onClick={() =>
                            goToPage(page)
                          }
                        >
                          {page}
                        </button>

                      ))}

                    </div>

                    <button
                      type="button"
                      className="page-btn prev-next"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={() =>
                        goToPage(currentPage + 1)
                      }
                    >
                      Next →
                    </button>

                  </div>

                )}

                {/* PAGE INFO */}

                <div className="pagination-info">

                  Showing{" "}
                  <strong>
                    {startIndex + 1}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(
                      endIndex,
                      appointments.length
                    )}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {appointments.length}
                  </strong>{" "}
                  appointments

                </div>

              </>

            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
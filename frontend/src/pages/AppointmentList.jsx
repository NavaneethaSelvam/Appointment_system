
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AppointmentList.css";

// ==========================================
// FASTAPI BACKEND
// ==========================================

const API_URL = "http://127.0.0.1:8000/api";

const APPOINTMENTS_URL =
  `${API_URL}/appointments`;

const ADMIN_APPOINTMENTS_URL =
  `${API_URL}/admin/appointments`;

// Records per page
const ITEMS_PER_PAGE = 10;


function AppointmentList() {

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);


  // ==========================================
  // GET ADMIN TOKEN
  // ==========================================

  const getAdminToken = () => {
    return localStorage.getItem("admin_token");
  };


  // ==========================================
  // CHECK ADMIN AUTHENTICATION
  // ==========================================

  const checkAdminAuthentication = () => {

    const token = getAdminToken();

    if (!token) {

      alert(
        "Authentication required. Please login as admin."
      );

      navigate("/admin-login");

      return false;
    }

    return true;
  };


  // ==========================================
  // FETCH ALL ADMIN APPOINTMENTS
  // ==========================================

  const fetchAppointments = async () => {

    try {

      setLoading(true);

      const token = getAdminToken();


      // ----------------------------------------
      // TOKEN CHECK
      // ----------------------------------------

      if (!token) {

        alert(
          "Authentication required. Please login as admin."
        );

        navigate("/admin-login");

        return;
      }


      // ----------------------------------------
      // GET ALL APPOINTMENTS
      // ----------------------------------------

      const response = await axios.get(
        ADMIN_APPOINTMENTS_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "Admin appointments:",
        response.data
      );


      setAppointments(
        response.data
      );


      setCurrentPage(1);

    } catch (error) {

      console.error(
        "Fetch admin appointments error:",
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


      // ----------------------------------------
      // AUTHENTICATION ERROR
      // ----------------------------------------

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin_user"
        );

        alert(
          "Authentication failed. Please login again as admin."
        );

        navigate("/admin-login");

        return;
      }


      alert(
        error.response?.data?.detail ||
        "Unable to load appointments."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================

  useEffect(() => {

    fetchAppointments();

  }, []);


  // ==========================================
  // DELETE APPOINTMENT
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this appointment?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      console.log(
        "Deleting appointment:",
        id
      );


      const response = await axios.delete(
        `${APPOINTMENTS_URL}/${id}`
      );


      console.log(
        "Delete response:",
        response.data
      );


      // ----------------------------------------
      // REMOVE FROM UI
      // ----------------------------------------

      setAppointments(
        (currentAppointments) =>
          currentAppointments.filter(
            (appointment) =>
              appointment.id !== id
          )
      );


      alert(
        "Appointment deleted successfully!"
      );

    } catch (error) {

      console.error(
        "Delete error:",
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


      alert(
        error.response?.data?.detail ||
        "Unable to delete appointment."
      );
    }
  };


  // ==========================================
  // CHANGE APPOINTMENT STATUS
  // ==========================================

  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      console.log(
        "Updating appointment:",
        id,
        status
      );


      // ----------------------------------------
      // GET ADMIN TOKEN
      // ----------------------------------------

      const token = getAdminToken();


      // ----------------------------------------
      // TOKEN CHECK
      // ----------------------------------------

      if (!token) {

        alert(
          "Authentication required. Please login as admin."
        );

        navigate("/admin-login");

        return;
      }


      // ----------------------------------------
      // UPDATE STATUS
      // ----------------------------------------

      const response = await axios.put(

        `${ADMIN_APPOINTMENTS_URL}/${id}/status`,

        null,

        {
          params: {
            status: status,
          },

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      console.log(
        "Status update response:",
        response.data
      );


      // ----------------------------------------
      // UPDATE UI
      // ----------------------------------------

      setAppointments(
        (currentAppointments) =>
          currentAppointments.map(
            (appointment) =>
              appointment.id === id
                ? {
                    ...appointment,
                    status: status,
                  }
                : appointment
          )
      );


      alert(
        "Appointment status updated successfully!"
      );


    } catch (error) {

      console.error(
        "Status update error:",
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


      // ----------------------------------------
      // AUTHENTICATION ERROR
      // ----------------------------------------

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem(
          "admin_token"
        );

        localStorage.removeItem(
          "admin_user"
        );


        alert(
          "Authentication failed. Please login again as admin."
        );


        navigate("/admin-login");

        return;
      }


      // ----------------------------------------
      // OTHER ERROR
      // ----------------------------------------

      alert(
        error.response?.data?.detail ||
        "Unable to update appointment status."
      );
    }
  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (time) => {

    if (!time) {
      return "";
    }


    const [
      hours,
      minutes
    ] = time.split(":");


    const date = new Date();


    date.setHours(
      Number(hours)
    );


    date.setMinutes(
      Number(minutes)
    );


    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const pendingCount =
    appointments.filter(
      (item) =>
        item.status === "Pending"
    ).length;


  const acceptedCount =
    appointments.filter(
      (item) =>
        item.status === "Accepted"
    ).length;


  const completedCount =
    appointments.filter(
      (item) =>
        item.status === "Completed"
    ).length;


  const cancelledCount =
    appointments.filter(
      (item) =>
        item.status === "Cancelled"
    ).length;


  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    appointments.length /
      ITEMS_PER_PAGE
  );


  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;


  const endIndex =
    startIndex +
    ITEMS_PER_PAGE;


  const currentAppointments =
    appointments.slice(
      startIndex,
      endIndex
    );


  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }


    setCurrentPage(page);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // AFTER DELETE / DATA CHANGE
  // ==========================================

  useEffect(() => {

    const newTotalPages =
      Math.ceil(
        appointments.length /
          ITEMS_PER_PAGE
      );


    if (
      currentPage > newTotalPages &&
      newTotalPages > 0
    ) {

      setCurrentPage(
        newTotalPages
      );
    }


    if (
      appointments.length === 0
    ) {

      setCurrentPage(1);

    }

  }, [
    appointments.length,
    currentPage,
  ]);


  // ==========================================
  // UI
  // ==========================================

  return (

    <main className="list-page">


      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <section className="list-hero">

        <div>

          <span className="section-label">
            APPOINTMENT MANAGEMENT
          </span>


          <h1>

            Manage Your

            <span>
              {" "}Appointments
            </span>

          </h1>


          <p>

            View, update and manage all your
            appointment records from one place.

          </p>

        </div>


        <button
          className="new-appointment-btn"
          onClick={() =>
            navigate("/")
          }
        >

          ＋ New Appointment

        </button>

      </section>


      {/* ======================================
          STATISTICS
      ======================================= */}

      <section className="management-stats">


        {/* TOTAL */}

        <div className="management-card">

          <div className="management-icon total">
            📋
          </div>


          <div>

            <span>
              Total
            </span>


            <strong>
              {appointments.length}
            </strong>

          </div>

        </div>


        {/* PENDING */}

        <div className="management-card">

          <div className="management-icon pending">
            ⏳
          </div>


          <div>

            <span>
              Pending
            </span>


            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        {/* ACCEPTED */}

        <div className="management-card">

          <div className="management-icon confirmed">
            ✓
          </div>


          <div>

            <span>
              Accepted
            </span>


            <strong>
              {acceptedCount}
            </strong>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="management-card">

          <div className="management-icon completed">
            ★
          </div>


          <div>

            <span>
              Completed
            </span>


            <strong>
              {completedCount}
            </strong>

          </div>

        </div>


        {/* CANCELLED */}

        <div className="management-card">

          <div className="management-icon cancelled">
            ×
          </div>


          <div>

            <span>
              Cancelled
            </span>


            <strong>
              {cancelledCount}
            </strong>

          </div>

        </div>

      </section>


      {/* ======================================
          APPOINTMENT RECORDS
      ======================================= */}

      <section className="appointments-card">


        <div className="appointments-header">

          <div>

            <h2>
              Appointment Records
            </h2>


            <p>
              All saved appointment records
              are displayed below.
            </p>

          </div>


          <div className="record-count">

            {appointments.length} Records

          </div>

        </div>


        {/* ====================================
            LOADING
        ===================================== */}

        {loading ? (

          <div className="loading-state">

            <div className="large-spinner"></div>


            <p>
              Loading appointments...
            </p>

          </div>


        ) : appointments.length === 0 ? (


          /* ==================================
              EMPTY STATE
          =================================== */

          <div className="empty-list">

            <div className="empty-animation">
              📅
            </div>


            <h3>
              No Appointments Found
            </h3>


            <p>
              You haven't created any
              appointment records yet.
            </p>


            <button
              onClick={() =>
                navigate("/")
              }
              className="book-first-btn"
            >

              Book Your First Appointment

            </button>

          </div>


        ) : (


          /* ==================================
              APPOINTMENT TABLE
          =================================== */

          <>

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

                  {currentAppointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.id
                        }
                      >


                        {/* PATIENT */}

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
                                ID #
                                {appointment.id}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="contact-cell">

                            <span>
                              {appointment.email}
                            </span>


                            {appointment.phone && (

                              <small>
                                {appointment.phone}
                              </small>

                            )}

                          </div>

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

                          <div className="date-cell">

                            📅{" "}
                            {appointment.date}

                          </div>

                        </td>


                        {/* TIME */}

                        <td>

                          <div className="time-cell">

                            ⏰{" "}

                            {formatTime(
                              appointment.time
                            )}

                          </div>

                        </td>


                        {/* STATUS */}

                        <td>

                          <select

                            className={`status-dropdown ${
                              appointment.status
                                ?.toLowerCase()
                            }`}

                            value={
                              appointment.status
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

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">


                            {/* EDIT */}

                            <button

                              className="action edit"

                              title="Edit appointment"

                              onClick={() =>
                                navigate(
                                  "/",
                                  {
                                    state: {
                                      appointment:
                                        appointment,
                                    },
                                  }
                                )
                              }

                            >

                              ✏️

                            </button>


                            {/* DELETE */}

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

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================
                PAGINATION
            ================================= */}

            {appointments.length > 0 && (

              <div className="pagination-wrapper">


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

                  records

                </div>


                <div className="pagination-controls">


                  {/* PREVIOUS */}

                  <button

                    className="pagination-btn previous"

                    disabled={
                      currentPage === 1
                    }

                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }

                  >

                    ← Previous

                  </button>


                  {/* PAGE NUMBERS */}

                  <div className="page-numbers">

                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (page) => (

                        <button

                          key={page}

                          className={`page-number ${
                            currentPage === page
                              ? "active"
                              : ""
                          }`}

                          onClick={() =>
                            goToPage(page)
                          }

                        >

                          {page}

                        </button>

                      )
                    )}

                  </div>


                  {/* NEXT */}

                  <button

                    className="pagination-btn next"

                    disabled={
                      currentPage ===
                      totalPages
                    }

                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }

                  >

                    Next →

                  </button>

                </div>

              </div>

            )}

          </>

        )}

      </section>

    </main>
  );
}


export default AppointmentList;


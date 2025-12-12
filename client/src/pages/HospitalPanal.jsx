import React, { useContext, useEffect, useState } from "react";
import API from "../api";
import { UserContext } from "../store/userContext";
import "../styles/HospitalPanal.css";
import { databaseUrls } from "../data/databaseUrls";

const HospitalAppointments = () => {
  const { user, isAuthenticated } = useContext(UserContext); // ensure user is loaded
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchAppointments = async () => {
      if (!user || !isAuthenticated) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await API.get(`${databaseUrls.hospitals.appointments}/${user._id}`);
        if (mounted) {
          setAppointments(Array.isArray(res.data) ? res.data : []);
          setError("");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        if (mounted) setError("Unable to fetch appointments");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAppointments();

    return () => {
      mounted = false;
    };
  }, [user, isAuthenticated]);

  const deleteAppointment = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await API.delete(`${databaseUrls.hospitals.appointments}/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert("Failed to delete appointment. Try again later.");
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div className="error-message">Please log in to view your appointments.</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <div className="appointment-container">
        <h1 className="title">Hospital Appointments</h1>
        <div className="appointment-list">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="card-content">
                  <h3 className="appointment-reason">{appointment.reason}</h3>
                  <p>
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${appointment.status}`}>{appointment.status}</span>
                  </p>
                  {appointment.userId && (
                    <>
                      <p>
                        <strong>Patient Name:</strong> {appointment.userId.name}
                      </p>
                      <p>
                        <strong>Patient Email:</strong> {appointment.userId.email}
                      </p>
                    </>
                  )}
                </div>
                <div className="card-actions">
                  <button className="delete-button" onClick={() => deleteAppointment(appointment._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-appointments">No appointments available.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default HospitalAppointments;

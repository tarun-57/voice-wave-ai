import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Appointments Dashboard</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Name</th>
            <th style={styles.header}>Date</th>
            <th style={styles.header}>Time</th>
            <th style={styles.header}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td style={styles.cell}>{appointment.name}</td>
                <td style={styles.cell}>{appointment.date}</td>
                <td style={styles.cell}>{appointment.time}</td>
                <td style={styles.cell}>{appointment.reason}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No appointments available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
    fontSize: "16px",
    textAlign: "left",
  },
  header: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
  },
  cell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  noData: {
    textAlign: "center",
    padding: "10px",
    color: "#666",
  },
};

export default Dashboard;

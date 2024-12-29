// src/contexts/AppointmentContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AppointmentContext = createContext();

export const useAppointments = () => {
  return useContext(AppointmentContext);
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const addAppointment = (newAppointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
  };

  return (
    <AppointmentContext.Provider value={{ appointments, fetchAppointments, addAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

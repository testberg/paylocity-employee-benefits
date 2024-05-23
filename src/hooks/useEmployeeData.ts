// src/hooks/useEmployeeData.js

import { useState, useEffect } from "react";
import { loadEmployeeData, saveEmployeeData } from "../utils/storage";
import { initialEmployees } from "../mockData";
import { Employee } from "../types";

// Custom hook to manage employee data
const useEmployeeData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let data = loadEmployeeData();
    saveEmployees(data.length === 0 ? initialEmployees : data);
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    saveEmployeeData(newEmployees);
  };

  return { employees, saveEmployees };
};

export default useEmployeeData;

import { Employee } from "../types";

export const loadEmployeeData = () => {
  const data = localStorage.getItem('employees');
  return data ? JSON.parse(data) as Employee[] : [];
};

export const saveEmployeeData = (data: Employee[]) => {
  localStorage.setItem('employees', JSON.stringify(data));
};

// src/utils/storage.js
export const loadEmployeeData = () => {
  const data = localStorage.getItem('employees');
  return data ? JSON.parse(data) : [];
};

export const saveEmployeeData = (data) => {
  localStorage.setItem('employees', JSON.stringify(data));
};

import { useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import useEmployeeData from "./hooks/useEmployeeData";
import {
  GROSS_PAY,
  BASE_COST,
  DEPENDENT_COST,
  DISCOUNT,
  PAYCHECKS_PER_YEAR,
} from "./constants";
import "./App.css";
import { Employee } from "./types";

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const { employees, saveEmployees } = useEmployeeData();

  const calculateBenefits = (employee: Employee) => {
    let totalAnnualCost = 0;

    // Calculate the employee's cost
    if (employee.name.startsWith("A")) {
      totalAnnualCost += BASE_COST * (1 - DISCOUNT);
    } else {
      totalAnnualCost += BASE_COST;
    }

    // Calculate the dependents' costs
    employee.dependents.forEach((dependent) => {
      if (dependent.name.startsWith("A")) {
        totalAnnualCost += DEPENDENT_COST * (1 - DISCOUNT);
      } else {
        totalAnnualCost += DEPENDENT_COST;
      }
    });

    // Calculate the cost per paycheck
    const costPerPaycheck = totalAnnualCost / PAYCHECKS_PER_YEAR;
    return costPerPaycheck
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = (employeeId: string) => {
    const newEmployees = employees.filter((emp) => emp.id !== employeeId);
    saveEmployees(newEmployees);
  };

  const handleFinish = () => setSelectedEmployee(null);

  const calculateNetPay = (benefitsDeduction: number) => {
    const netPay = GROSS_PAY - benefitsDeduction;
    return netPay
  };

  return (
    <div className="App">
      <h1>Employee Benefits Cost Calculator</h1>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Dependents</th>
            <th>Cost per Paycheck</th>
            <th>Net Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => {
            const benefits = calculateBenefits(employee);
            return (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.dependents.map((dep) => dep.name).join(", ")}</td>
                <td>${benefits.toFixed(2)}</td>
                <td>${calculateNetPay(benefits).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedEmployee && (
        <div>
          <h2>Edit Employee</h2>
          <EmployeeForm employee={selectedEmployee} onFinish={handleFinish} />
        </div>
      )}
      {!selectedEmployee && (
        <div>
          <h2>Add Employee</h2>
          <EmployeeForm onFinish={handleFinish} />
        </div>
      )}
    </div>
  );
};

export default App;

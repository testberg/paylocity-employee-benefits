import { useState } from "react";
import { Table, Button } from "antd";
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
    return costPerPaycheck;
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = (employeeId: string) => {
    const newEmployees = employees.filter((emp) => emp.id !== employeeId);
    saveEmployees(newEmployees);
  };

  const handleFinish = () => {
    setSelectedEmployee(null);
  };

  const calculateNetPay = (benefitsDeduction: number) => {
    const netPay = GROSS_PAY - benefitsDeduction;
    return netPay;
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Dependents",
      dataIndex: "dependents",
      key: "dependents",
      render: (dependents: any[]) =>
        dependents.map((dep) => dep.name).join(", "),
    },
    {
      title: "Cost per Paycheck",
      dataIndex: "benefits",
      key: "benefits",
      render: (benefits: number) => `$${benefits.toFixed(2)}`,
    },
    {
      title: "Net Pay",
      dataIndex: "benefits",
      key: "netPay",
      render: (benefits: number) => `$${calculateNetPay(benefits).toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: Employee) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const dataSource = employees?.map((employee) => ({
    ...employee,
    key: employee.id,
    benefits: calculateBenefits(employee),
  }));

  return (
    <div className="App">
      <h1>Employee Benefits Cost Calculator</h1>
      <Table columns={columns} dataSource={dataSource} />
      <EmployeeForm
        open={!!selectedEmployee?.id}
        employee={selectedEmployee}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default App;

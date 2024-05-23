import React, { useState } from "react";
import { Employee, Dependent } from "../types";
import useEmployeeData from "../hooks/useEmployeeData";

interface EmployeeFormProps {
  employee?: Employee;
  onFinish: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onFinish }) => {
  const [name, setName] = useState<string>(employee ? employee.name : "");
  const { employees, saveEmployees } = useEmployeeData();

  const [dependents, setDependents] = useState<Dependent[]>(
    employee ? employee.dependents : []
  );

  const handleDependentChange = (index: number, newName: string) => {
    const newDependents = [...dependents];
    newDependents[index] = { ...newDependents[index], name: newName };
    setDependents(newDependents);
  };

  const handleAddDependent = () => {
    setDependents([...dependents, { id: Date.now().toString(), name: "" }]);
  };

  const handleRemoveDependent = (index: number) => {
    setDependents(dependents.filter((_, i) => i !== index));
  };

  const handleSave = (employee: Employee) => {
    const newEmployees = employees.map((emp) =>
      emp.id === employee.id ? employee : emp
    );
    if (!newEmployees.some((emp) => emp.id === employee.id)) {
      newEmployees.push(employee);
    }
    saveEmployees(newEmployees);
    onFinish();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave({ id: employee ? employee.id : Date.now().toString(), name, dependents });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Employee Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>Dependents:</label>
        {dependents.map((dependent, index) => (
          <div key={dependent.id}>
            <input
              type="text"
              value={dependent.name}
              onChange={(e) => handleDependentChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveDependent(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddDependent}>
          Add Dependent
        </button>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EmployeeForm;

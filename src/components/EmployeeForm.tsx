import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { Employee, Dependent } from "../types";
import useEmployeeData from "../hooks/useEmployeeData";

interface EmployeeFormProps {
  open: boolean;
  employee: Employee | null;
  onFinish: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  employee,
  onFinish,
}) => {
  const [form] = Form.useForm();
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

  const handleSave = (values: any) => {
    const { name, dependents } = values;
    const newEmployee: Employee = {
      id: employee ? employee.id : Date.now().toString(),
      name,
      dependents,
    };

    const newEmployees = employees.map((emp) =>
      emp.id === newEmployee.id ? newEmployee : emp
    );
    if (!newEmployees.some((emp) => emp.id === newEmployee.id)) {
      newEmployees.push(newEmployee);
    }
    saveEmployees(newEmployees);
    onFinish();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      handleSave(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onFinish();
  };

  return (
    <Modal
      title={employee ? "Edit Employee" : "Add Employee"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ ...employee }}
      >
        <Form.Item
          label="Employee Name"
          name="name"
          rules={[{ required: true, message: "Please enter employee name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Dependents">
          {dependents.map((dependent, index) => (
            <div key={dependent.id}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name={["dependents", index, "name"]}
                rules={[
                  { required: true, message: "Please enter dependent name" },
                ]}
              >
                <Input
                  onChange={(e) => handleDependentChange(index, e.target.value)}
                />
              </Form.Item>
              <Button type="link" onClick={() => handleRemoveDependent(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="link" onClick={handleAddDependent}>
            Add Dependent
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;

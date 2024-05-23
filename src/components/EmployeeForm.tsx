import React from "react";
import { Modal, Form, Input } from "antd";
import { Employee } from "../types";
import useEmployeeData from "../hooks/useEmployeeData";

interface EmployeeFormProps {
  open: boolean;
  employee?: Employee;
  onFinish: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  employee,
  onFinish,
}) => {
  const [form] = Form.useForm();
  const { addEmployeeMutation, editEmployeeMutation } = useEmployeeData();

  form.setFieldsValue({ ...employee });

  const handleSubmit = async () => {
    try {
      const { name } = await form.validateFields();

      const newEmployee: Employee = {
        id: employee ? employee.id : Date.now().toString(),
        name,
        dependents: employee?.dependents,
      };

      employee
        ? await editEmployeeMutation.mutateAsync(newEmployee)
        : await addEmployeeMutation.mutateAsync(newEmployee);

      handleCancel();
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
      confirmLoading={
        editEmployeeMutation.isLoading || addEmployeeMutation.isLoading
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter employee name" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;

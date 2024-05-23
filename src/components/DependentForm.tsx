import React from "react";
import { Modal, Form, Input } from "antd";
import { Dependent } from "../types";
import useEmployeeData from "../hooks/useEmployeeData";

interface DependentFormProps {
  open: boolean;
  dependent: {
    employeeId: string;
    id?: string;
    name?: string;
  };
  onFinish: () => void;
}

const DependentForm: React.FC<DependentFormProps> = ({
  open,
  dependent,
  onFinish,
}) => {
  const [form] = Form.useForm();
  form.setFieldsValue({ name: dependent?.name });
  const { addDependentMutation, editDependentMutation } = useEmployeeData();

  const handleSubmit = async () => {
    if (!dependent) {
      return;
    }
    try {
      const { name } = await form.validateFields();

      const newDependent: Dependent = {
        id: dependent?.id ?? Date.now().toString(),
        name,
      };

      dependent?.id
        ? await editDependentMutation.mutateAsync({
            employeeId: dependent.employeeId,
            updatedDependent: newDependent,
          })
        : await addDependentMutation.mutateAsync({
            employeeId: dependent.employeeId,
            newDependent: newDependent,
          });

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
      title={dependent?.id ? "Edit Dependent" : "Add Dependent"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={
        editDependentMutation.isLoading || addDependentMutation.isLoading
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter dependent name" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DependentForm;

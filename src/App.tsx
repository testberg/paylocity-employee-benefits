import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import EmployeeForm from "./components/EmployeeForm";
import useEmployeeData from "./hooks/useEmployeeData";
import { Dependent, Employee } from "./types";
import { calculateNetPay, calculateBenefits } from "./utils/benefits";
import DependentForm from "./components/DependentForm";
import "./App.css";

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const [isEmployeeOpenModal, setIsEmployeeModalOpen] =
    useState<boolean>(false);

  const [selectedDependent, setSelectedDependent] = useState<{
    employeeId: string;
    dependent?: Dependent;
  }>();

  const [isDependentOpenModal, setIsDependentModalOpen] =
    useState<boolean>(false);

  const {
    employees,
    resetData,
    deleteEmployeeMutation,
    deleteDependentMutation,
    status,
  } = useEmployeeData();

  const handleDataRest = () => {
    resetData();
  };

  const handleAddEmployee = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    deleteEmployeeMutation.mutateAsync(employee.id);
  };

  const handleAddDependent = (employeeId: string) => {
    setSelectedDependent({ employeeId });
  };

  const handleEditDependent = (employeeId: string, dependent: Dependent) => {
    setSelectedDependent({ employeeId, dependent });
  };

  const handleDeleteDependent = (employeeId: string, dependentId: string) => {
    deleteDependentMutation.mutate({ employeeId, dependentId: dependentId });
  };

  const handleFinish = () => {
    setSelectedEmployee(undefined);
    setSelectedDependent(undefined);
    setIsEmployeeModalOpen(false);
    setIsDependentModalOpen(false);
  };

  useEffect(() => {
    setIsEmployeeModalOpen(!!selectedEmployee);
  }, [selectedEmployee]);

  useEffect(() => {
    setIsDependentModalOpen(!!selectedDependent);
  }, [selectedDependent]);

  const columns = [
    { title: "Employee", dataIndex: "name", key: "name" },
    Table.EXPAND_COLUMN,
    {
      title: "Dependents",
      dataIndex: "dependents",
      key: "dependents",
      render: (dependents: Dependent[]) => dependents?.length ?? "NA",
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
      title: "Action",
      key: "actions",
      render: (_: string, record: Employee) => (
        <span>
          <Button type="link" onClick={() => handleEditEmployee(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the employee"
            description="Are you sure to delete this employee?"
            onConfirm={() => handleDeleteEmployee(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button type="link" onClick={() => handleAddDependent(record.id)}>
            Add Dependent
          </Button>
        </span>
      ),
    },
  ];

  const dataSource = employees?.map((employee: Employee) => ({
    ...employee,
    key: employee.id,
    benefits: calculateBenefits(employee),
  }));

  const expandedRowRender = (record: Employee) => {
    if (!record.dependents || record.dependents?.length === 0) {
      return "No Dependents Found";
    }

    const columns = [
      { title: "Dependent", dataIndex: "name", key: "name" },
      {
        title: "Action",
        key: "operation",
        render: (_: string, dependent: Dependent) => (
          <span>
            <Button
              type="link"
              onClick={() => handleEditDependent(record.id, dependent)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the dependent"
              description="Are you sure to delete this dependent?"
              onConfirm={() => handleDeleteDependent(record.id, dependent.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.dependents?.map((dep) => ({ key: dep.id, ...dep }))}
        pagination={false}
      />
    );
  };

  return (
    <div className="App">
      <h1>Employee Benefits Cost Calculator</h1>
      <Space size={"middle"} style={{ marginBottom: 16 }}>
        <Button type="primary" ghost onClick={handleAddEmployee}>
          New Employee
        </Button>
        <Button type="primary" ghost onClick={handleDataRest}>
          Reset
        </Button>
      </Space>
      <Table
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandAllRows: true }}
        dataSource={dataSource}
        loading={status === "loading"}
      />
      <EmployeeForm
        open={isEmployeeOpenModal}
        employee={selectedEmployee}
        onFinish={handleFinish}
      />
      {selectedDependent?.employeeId && (
        <DependentForm
          open={isDependentOpenModal}
          dependent={{
            ...selectedDependent?.dependent,
            employeeId: selectedDependent.employeeId,
          }}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default App;

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { loadEmployeeData, saveEmployeeData } from '../utils/storage';
import { initialEmployees } from '../mockData';
import { Employee, Dependent } from '../types';

const fetchEmployeeData = async () => {
  const data = loadEmployeeData();
  return data.length ? data : initialEmployees;
};

const useEmployeeData = () => {
  const queryClient = useQueryClient();

  const { data: employees, status } = useQuery('employees', fetchEmployeeData, {
    initialData: initialEmployees,
  });

  const saveEmployees = (newEmployees: Employee[]) => {
    saveEmployeeData(newEmployees);
    queryClient.setQueryData('employees', newEmployees);
  };

  const addEmployeeMutation = useMutation(
    async (newEmployee: Employee) => {
      const updatedEmployees = employees ? [...employees, newEmployee] : [newEmployee]
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const editEmployeeMutation = useMutation(
    async (updatedEmployee: Employee) => {
      const updatedEmployees = employees?.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      ) ?? []
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const deleteEmployeeMutation = useMutation(
    async (employeeId: string) => {
      const updatedEmployees = employees?.filter((employee: { id: string; }) => employee.id !== employeeId) ?? []
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const addDependentMutation = useMutation(
    async ({ employeeId, newDependent }: { employeeId: string, newDependent: Dependent }) => {
      const updatedEmployees = employees?.map((employee) =>
        employee.id === employeeId
          ? { ...employee, dependents: employee.dependents ? [...employee.dependents, newDependent] : [newDependent] }
          : employee
      ) ?? []
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const editDependentMutation = useMutation(
    async ({ employeeId, updatedDependent }: { employeeId: string, updatedDependent: Dependent }) => {
      const updatedEmployees = employees?.map((employee) =>
        employee.id === employeeId
          ? {
            ...employee,
            dependents: employee.dependents?.map((dependent) =>
              dependent.id === updatedDependent.id ? updatedDependent : dependent
            ),
          }
          : employee
      ) ?? []
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const deleteDependentMutation = useMutation(
    async ({ employeeId, dependentId }: { employeeId: string, dependentId: string }) => {
      const updatedEmployees = employees?.map((employee) =>
        employee.id === employeeId
          ? {
            ...employee,
            dependents: employee.dependents?.filter(
              (dependent: { id: string; }) => dependent.id !== dependentId
            ),
          }
          : employee
      ) ?? []
      saveEmployees(updatedEmployees);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );

  const resetData = () => {
    saveEmployeeData(initialEmployees);
    queryClient.setQueryData('employees', initialEmployees);
  };

  return {
    employees,
    status,
    resetData,
    addEmployeeMutation,
    editEmployeeMutation,
    deleteEmployeeMutation,
    addDependentMutation,
    editDependentMutation,
    deleteDependentMutation,
  };
};

export default useEmployeeData;

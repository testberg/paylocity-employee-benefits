
export interface Person {
    id: string;
    name: string;
}

export interface Dependent extends Person {
    employeeId?: string
}

export interface Employee extends Person {
    dependents?: Dependent[];
}
export interface Dependent {
    id: string;
    name: string;
}

export interface Employee {
    id: string;
    name: string;
    dependents: Dependent[];
}
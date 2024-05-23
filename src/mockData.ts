import { Employee } from "./types";

export const initialEmployees: Employee[] = [
    {
        id: '1',
        name: "John Doe",
        dependents: [{
            id: '1-1',
            name: "Jane Doe"
        }, {
            id: '1-2',
            name: "Baby Doe"
        }]
    },
    {
        id: '2',
        name: "Alice Johnson",
        dependents: [{
            id: "2-1",
            name: "Bob Johnson",
        }]
    }
];


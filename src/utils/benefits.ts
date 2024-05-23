import { BASE_COST, DISCOUNT, DEPENDENT_COST, PAYCHECKS_PER_YEAR, GROSS_PAY } from "../constants";
import { Employee } from "../types";

export const calculateBenefits = (employee: Employee) => {
    let totalAnnualCost = 0;

    // Calculate the employee's cost
    if (employee.name.startsWith("A")) {
        totalAnnualCost += BASE_COST * (1 - DISCOUNT);
    } else {
        totalAnnualCost += BASE_COST;
    }

    // Calculate the dependents' costs
    employee.dependents?.forEach((dependent) => {
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

export const calculateNetPay = (benefitsDeduction: number) => {
    const netPay = GROSS_PAY - benefitsDeduction;
    return netPay;
};

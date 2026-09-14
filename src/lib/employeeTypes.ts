export const employeeFields = [
  "EmployeeId",
  "ReportsTo",
  "Name",
  "Job",
  "Phone",
  "Email",
  "OrgUnit",
  "Salary",
  "Gender",
  "MaritalStatus",
  "EmployeeType",
  "EmployeeStatus",
] as const;

export type EmployeeField = (typeof employeeFields)[number];

export type Employee = Record<EmployeeField, string>;

export type TransposedRow = {
  field: EmployeeField;
  values: string[];
};

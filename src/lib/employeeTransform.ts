import { Employee, EmployeeField, TransposedRow, employeeFields } from "./employeeTypes";

const readText = (employeeNode: Element, field: EmployeeField): string => {
  return employeeNode.getElementsByTagName(field)[0]?.textContent?.trim() ?? "";
};

export const parseEmployeesXml = (xml: string): Employee[] => {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = document.getElementsByTagName("parsererror")[0];

  if (parserError) {
    throw new Error("The XML file could not be parsed.");
  }

  // Keep the parser tied to the expected fields so missing XML tags become blank cells.
  const nodes = Array.from(document.getElementsByTagName("employee"));

  return nodes.map((node) => {
    return employeeFields.reduce((record, field) => {
      record[field] = readText(node, field);
      return record;
    }, {} as Employee);
  });
};

export const sortEmployeesById = (employees: Employee[]): Employee[] => {
  // Copy before sorting so callers do not get their original array mutated.
  return [...employees].sort((left, right) => {
    const leftId = Number(left.EmployeeId);
    const rightId = Number(right.EmployeeId);
    return leftId - rightId;
  });
};

export const transposeEmployees = (
  employees: Employee[],
  fieldOrder: readonly EmployeeField[] = employeeFields,
): TransposedRow[] => {
  // Each field becomes one row, and each employee contributes one value in that row.
  return fieldOrder.map((field) => ({
    field,
    values: employees.map((employee) => employee[field]),
  }));
};

export const toCsv = (rows: string[][]): string => {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell ?? "";
          // Escape quotes so downloaded CSV files still open cleanly in spreadsheet apps.
          const escaped = value.replace(/"/g, '""');
          return /[",\n\r]/.test(value) ? `"${escaped}"` : escaped;
        })
        .join(","),
    )
    .join("\n");
};

export const employeesToCsv = (employees: Employee[]): string => {
  return toCsv([
    [...employeeFields],
    ...employees.map((employee) => employeeFields.map((field) => employee[field])),
  ]);
};

export const transposedToCsv = (rows: TransposedRow[], employees: Employee[]): string => {
  return toCsv([
    ["Field", ...employees.map((employee) => employee.EmployeeId || employee.Name)],
    ...rows.map((row) => [row.field, ...row.values]),
  ]);
};

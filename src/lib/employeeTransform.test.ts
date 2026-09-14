import { describe, expect, it } from "vitest";
import { parseEmployeesXml, sortEmployeesById, transposeEmployees } from "./employeeTransform";

const fixture = `
<List>
  <employee>
    <EmployeeId>192</EmployeeId>
    <ReportsTo>4</ReportsTo>
    <Name>Ralph Brogan</Name>
    <Job>Mgr Software Client Supp</Job>
    <Phone>x32524</Phone>
    <Email>rbrogan@server.com</Email>
    <OrgUnit>Management</OrgUnit>
    <Salary>13700.00</Salary>
    <Gender>male</Gender>
    <MaritalStatus>married</MaritalStatus>
    <EmployeeType>full time</EmployeeType>
    <EmployeeStatus>active</EmployeeStatus>
  </employee>
  <employee>
    <EmployeeId>4</EmployeeId>
    <ReportsTo>1</ReportsTo>
    <Name>Charles Madigen</Name>
    <Job>Chief Operating Officer</Job>
    <Phone>x10962</Phone>
    <Email>cmadigan@server.com</Email>
    <OrgUnit>Management</OrgUnit>
    <Salary>26200.00</Salary>
    <Gender>male</Gender>
    <MaritalStatus>married</MaritalStatus>
    <EmployeeType>full time</EmployeeType>
    <EmployeeStatus>active</EmployeeStatus>
  </employee>
</List>`;

describe("employee transformation", () => {
  it("parses XML employee records", () => {
    const employees = parseEmployeesXml(fixture);

    expect(employees).toHaveLength(2);
    expect(employees[0].EmployeeId).toBe("192");
    expect(employees[1].Name).toBe("Charles Madigen");
  });

  it("sorts employees by numeric EmployeeId", () => {
    const sorted = sortEmployeesById(parseEmployeesXml(fixture));

    expect(sorted.map((employee) => employee.EmployeeId)).toEqual(["4", "192"]);
  });

  it("transposes employees using a configurable field order", () => {
    const sorted = sortEmployeesById(parseEmployeesXml(fixture));
    const transposed = transposeEmployees(sorted, ["Name", "EmployeeId", "Job"]);

    expect(transposed).toEqual([
      { field: "Name", values: ["Charles Madigen", "Ralph Brogan"] },
      { field: "EmployeeId", values: ["4", "192"] },
      { field: "Job", values: ["Chief Operating Officer", "Mgr Software Client Supp"] },
    ]);
  });
});

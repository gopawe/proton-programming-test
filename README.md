# Employee Transform Matrix

A TypeScript + React implementation of the programming test in `Test（English）.xlsx`.

## What it does

- Reads employee XML records from `employees.data.xml`.
- Sorts records by `EmployeeId` in ascending numeric order.
- Displays the sorted employee table.
- Displays a transposed matrix where employee fields become rows and employees become columns.
- Allows the transposed row order to be changed in the UI.
- Exports either view as CSV.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Verify

```bash
npm test
npm run build
```

## Design notes

The transformation logic is kept in `src/lib` so parsing, sorting, and transposition can be tested independently from the React UI. The UI is intentionally thin: it previews the two required outputs, lets the row order be changed, and supports CSV export without adding backend complexity.
## Additional UI notes

The app includes a Home page, Result page, and My Approach page. The language toggle switches the interface and approach notes between English and Japanese.

import sampleXml from "../employees.data.xml?raw";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  employeesToCsv,
  parseEmployeesXml,
  sortEmployeesById,
  transposedToCsv,
  transposeEmployees,
} from "./lib/employeeTransform";
import { Employee, EmployeeField, employeeFields } from "./lib/employeeTypes";

type Language = "en" | "ja";
type Page = "home" | "tool" | "approach";
type ViewMode = "sorted" | "transposed";

type Copy = {
  appTitle: string;
  appSubtitle: string;
  homePage: string;
  toolPage: string;
  approachPage: string;
  companyLabel: string;
  programmerLabel: string;
  overviewLabel: string;
  overview: string;
  programmingTest: string;
  viewResult: string;
  loadXml: string;
  exportCsv: string;
  source: string;
  employeesLoaded: string;
  sortedBy: string;
  rowOrder: string;
  reset: string;
  up: string;
  down: string;
  sortedTable: string;
  transposedTable: string;
  parseError: string;
  field: string;
  approachTitle: string;
  approachIntro: string;
  points: { title: string; body: string }[];
};

const companyName = "Proto Solution Co., Ltd.";
const programmerName = "Abel V. Massaley";

const text: Record<Language, Copy> = {
  en: {
    appTitle: "Employee XML transform",
    appSubtitle: "Sort by EmployeeId, then transpose rows and columns.",
    homePage: "Home",
    toolPage: "The Result",
    approachPage: "My Approach",
    companyLabel: "Company",
    programmerLabel: "Programmer",
    overviewLabel: "Overview",
    overview:
      "I used a simple React and TypeScript implementation to read the employee XML, sort records by EmployeeId, and display both the sorted result and the transposed matrix. I also added Japanese and English language switching for easier review.",
    programmingTest: "Programming Test",
    viewResult: "View Result",
    loadXml: "Load XML",
    exportCsv: "Export CSV",
    source: "Source",
    employeesLoaded: "employees loaded",
    sortedBy: "Sorted by EmployeeId ascending",
    rowOrder: "Transpose row order",
    reset: "Reset",
    up: "Up",
    down: "Down",
    sortedTable: "Sorted table",
    transposedTable: "Transposed table",
    parseError: "Unable to parse XML.",
    field: "Field",
    approachTitle: "My Thought Process",
    approachIntro:
      "I kept the solution small because the task is mainly a data transformation problem, not a large application problem.",
    points: [
      {
        title: "1. Understand the required output",
        body:
          "The XML contains employee records. The first required result is the same records sorted by EmployeeId. The second required result is a transposed matrix, where fields such as Name, Job, and Salary become rows.",
      },
      {
        title: "2. Keep transformation logic separate",
        body:
          "Parsing, sorting, transposing, and CSV export are implemented in separate functions under src/lib. This makes the behavior easier to test and keeps the UI from owning the business logic.",
      },
      {
        title: "3. Add a simple UI only where it helps",
        body:
          "The UI previews both required outputs and lets the user change the row order for the transposed table. I avoided a backend and full routing because those would add complexity without helping the test requirements.",
      },
      {
        title: "4. Include basic verification",
        body:
          "Unit tests cover XML parsing, EmployeeId sorting, and configurable transposition. The production build verifies that the TypeScript and Vite setup compile correctly.",
      },
      {
        title: "5. Keep the implementation easy to review",
        body:
          "I used plain React state and a small number of files so the reviewer can quickly follow the data flow from XML input to sorted output and transposed output. I also added Japanese and English text so the result can be checked comfortably in either language.",
      },
    ],
  },
  ja: {
    appTitle: "社員XML変換ツール",
    appSubtitle: "EmployeeIdで並び替えた後、行と列を入れ替えます。",
    homePage: "ホーム",
    toolPage: "結果",
    approachPage: "私の考え方",
    companyLabel: "会社名",
    programmerLabel: "作成者",
    overviewLabel: "概要",
    overview:
      "社員XMLを読み込み、EmployeeIdで並び替え、並び替え後の結果と転置テーブルを表示するシンプルなReact + TypeScript実装にしました。確認しやすいように、日本語と英語の切り替えも追加しました。",
    programmingTest: "Programming Test",
    viewResult: "結果を見る",
    loadXml: "XML読込",
    exportCsv: "CSV出力",
    source: "入力元",
    employeesLoaded: "件の社員データを読込済み",
    sortedBy: "EmployeeIdの昇順で並び替え",
    rowOrder: "転置後の行順",
    reset: "リセット",
    up: "上へ",
    down: "下へ",
    sortedTable: "並び替え後テーブル",
    transposedTable: "転置テーブル",
    parseError: "XMLを読み込めませんでした。",
    field: "項目",
    approachTitle: "私の考え方",
    approachIntro:
      "この課題は大きなアプリケーションではなく、データ変換が中心だと考えたため、実装は小さく保ちました。",
    points: [
      {
        title: "1. 必要な出力を確認",
        body:
          "XMLには社員レコードが入っています。まずEmployeeIdで昇順に並び替え、その後Name、Job、Salaryなどの項目を行にした転置テーブルを作成します。",
      },
      {
        title: "2. 変換ロジックを分離",
        body:
          "XML解析、並び替え、転置、CSV出力はsrc/lib配下の関数に分けました。これによりテストしやすく、UIに業務ロジックが混ざりにくくなります。",
      },
      {
        title: "3. UIは必要な範囲に限定",
        body:
          "UIでは必要な2種類の出力を確認でき、転置後の行順を変更できます。バックエンドや本格的なルーティングは、この課題には過剰だと判断しました。",
      },
      {
        title: "4. 基本的な検証を追加",
        body:
          "ユニットテストではXML解析、EmployeeIdの並び替え、行順を指定した転置を確認しています。本番ビルドではTypeScriptとViteの構成が正しく動くことも確認できます。",
      },
      {
        title: "5. レビューしやすい実装を意識",
        body:
          "Reactのstateと少ないファイル構成で実装し、XML入力から並び替え結果、転置結果までの流れを追いやすくしました。また、日本語と英語を切り替えられるようにし、どちらの言語でも確認しやすくしました。",
      },
    ],
  },
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

function App() {
  const [sourceName, setSourceName] = useState("employees.data.xml");
  const [xmlText, setXmlText] = useState(sampleXml);
  const [fieldOrder, setFieldOrder] = useState<EmployeeField[]>([...employeeFields]);
  const [viewMode, setViewMode] = useState<ViewMode>("transposed");
  // Page and language are kept local because this small app does not need routing or global state.
  const [page, setPage] = useState<Page>("home");
  const [language, setLanguage] = useState<Language>("ja");
  const [error, setError] = useState<string | null>(null);
  const t = text[language];

  const employees = useMemo<Employee[]>(() => {
    try {
      setError(null);
      return sortEmployeesById(parseEmployeesXml(xmlText));
    } catch {
      setError(t.parseError);
      return [];
    }
  }, [xmlText, t.parseError]);

  const transposedRows = useMemo(() => transposeEmployees(employees, fieldOrder), [employees, fieldOrder]);

  // Move one field at a time so the configured transpose order stays easy to follow.
  const moveField = (field: EmployeeField, direction: -1 | 1) => {
    setFieldOrder((current) => {
      const index = current.indexOf(field);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setSourceName(file.name);
    setXmlText(await file.text());
  };

  // Export whichever table the user is currently reviewing.
  const exportCurrentView = () => {
    if (viewMode === "sorted") {
      downloadFile("employees-sorted.csv", employeesToCsv(employees));
    } else {
      downloadFile("employees-transposed.csv", transposedToCsv(transposedRows, employees));
    }
  };

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>{page === "home" ? companyName : t.appTitle}</h1>
          <p>{page === "home" ? t.programmingTest : t.appSubtitle}</p>
        </div>
        <div className="header-actions">
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>
            {t.homePage}
          </button>
          <button className={page === "tool" ? "active" : ""} onClick={() => setPage("tool")}>
            {t.toolPage}
          </button>
          <button className={page === "approach" ? "active" : ""} onClick={() => setPage("approach")}>
            {t.approachPage}
          </button>
          <button onClick={() => setLanguage(language === "en" ? "ja" : "en")}>
            {language === "en" ? "日本語" : "English"}
          </button>
        </div>
      </header>

      {page === "home" && <HomePage setPage={setPage} t={t} />}
      {page === "tool" && (
        <ToolPage
          employees={employees}
          error={error}
          exportCurrentView={exportCurrentView}
          fieldOrder={fieldOrder}
          handleFile={handleFile}
          moveField={moveField}
          setFieldOrder={setFieldOrder}
          setViewMode={setViewMode}
          sourceName={sourceName}
          t={t}
          transposedRows={transposedRows}
          viewMode={viewMode}
        />
      )}
      {page === "approach" && <ApproachPage t={t} />}
    </main>
  );
}

function HomePage({ setPage, t }: { setPage: Dispatch<SetStateAction<Page>>; t: Copy }) {
  return (
    <section className="content home-page">
      <p className="home-kicker">{t.programmingTest}</p>
      <h2>{companyName}</h2>
      <dl className="home-details">
        <div>
          <dt>{t.companyLabel}</dt>
          <dd>{companyName}</dd>
        </div>
        <div>
          <dt>{t.programmerLabel}</dt>
          <dd>{programmerName}</dd>
        </div>
        <div>
          <dt>{t.overviewLabel}</dt>
          <dd>{t.overview}</dd>
        </div>
      </dl>
      <div className="home-actions">
        <button onClick={() => setPage("tool")}>{t.viewResult}</button>
        <button onClick={() => setPage("approach")}>{t.approachPage}</button>
      </div>
    </section>
  );
}

function ToolPage({
  employees,
  error,
  exportCurrentView,
  fieldOrder,
  handleFile,
  moveField,
  setFieldOrder,
  setViewMode,
  sourceName,
  t,
  transposedRows,
  viewMode,
}: {
  employees: Employee[];
  error: string | null;
  exportCurrentView: () => void;
  fieldOrder: EmployeeField[];
  handleFile: (file: File | undefined) => Promise<void>;
  moveField: (field: EmployeeField, direction: -1 | 1) => void;
  setFieldOrder: Dispatch<SetStateAction<EmployeeField[]>>;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  sourceName: string;
  t: Copy;
  transposedRows: ReturnType<typeof transposeEmployees>;
  viewMode: ViewMode;
}) {
  return (
    <section className="layout">
      <aside className="sidebar">
        <section className="box">
          <h2>{t.source}</h2>
          <p className="file-name">{sourceName}</p>
          <p>
            {employees.length} {t.employeesLoaded}
          </p>
          <p>{t.sortedBy}</p>
          <div className="side-actions">
            <label className="button">
              {t.loadXml}
              <input accept=".xml,text/xml" type="file" onChange={(event) => handleFile(event.target.files?.[0])} />
            </label>
            <button onClick={exportCurrentView}>{t.exportCsv}</button>
          </div>
        </section>

        <section className="box">
          <div className="box-title-row">
            <h2>{t.rowOrder}</h2>
            <button type="button" onClick={() => setFieldOrder([...employeeFields])}>
              {t.reset}
            </button>
          </div>
          <div className="field-list">
            {fieldOrder.map((field, index) => (
              <div className="field-row" key={field}>
                <span>{field}</span>
                <div className="field-buttons">
                  <button disabled={index === 0} onClick={() => moveField(field, -1)}>
                    {t.up}
                  </button>
                  <button disabled={index === fieldOrder.length - 1} onClick={() => moveField(field, 1)}>
                    {t.down}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <section className="content">
        <div className="tabs">
          <button className={viewMode === "sorted" ? "active" : ""} onClick={() => setViewMode("sorted")}>
            {t.sortedTable}
          </button>
          <button className={viewMode === "transposed" ? "active" : ""} onClick={() => setViewMode("transposed")}>
            {t.transposedTable}
          </button>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : viewMode === "sorted" ? (
          <SortedTable employees={employees} />
        ) : (
          <TransposedTable fieldLabel={t.field} rows={transposedRows} employees={employees} />
        )}
      </section>
    </section>
  );
}

function ApproachPage({ t }: { t: Copy }) {
  return (
    <section className="content approach-page">
      <h2>{t.approachTitle}</h2>
      <p>{t.approachIntro}</p>
      <div className="approach-list">
        {t.points.map((point) => (
          <section className="box" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </section>
        ))}
      </div>
    </section>
  );
}

function SortedTable({ employees }: { employees: Employee[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {employeeFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.EmployeeId}>
              {employeeFields.map((field) => (
                <td key={field}>{employee[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransposedTable({
  fieldLabel,
  rows,
  employees,
}: {
  fieldLabel: string;
  rows: ReturnType<typeof transposeEmployees>;
  employees: Employee[];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{fieldLabel}</th>
            {employees.map((employee) => (
              <th key={employee.EmployeeId}>{employee.EmployeeId}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.field}>
              <th>{row.field}</th>
              {row.values.map((value, index) => (
                <td key={`${row.field}-${employees[index]?.EmployeeId}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
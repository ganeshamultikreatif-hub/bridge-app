import type { ReportSummary } from "@/types/report";

function escapeCsv(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function reportToExcelCsv(summary: ReportSummary): string {
  const header = ["Label", "Department", "Sales", ...summary.columns].map(
    escapeCsv,
  );

  const lines = summary.rows.map((row) =>
    [
      row.label,
      row.department,
      row.sales,
      row.metricA,
      row.metricB,
      row.metricC,
      `${row.rate}%`,
    ]
      .map(escapeCsv)
      .join(","),
  );

  const totals = [
    "Total",
    "",
    "",
    summary.totals.metricA,
    summary.totals.metricB,
    summary.totals.metricC,
    `${summary.totals.rate}%`,
  ]
    .map(escapeCsv)
    .join(",");

  // BOM helps Excel open UTF-8 correctly
  return `\uFEFF${header.join(",")}\n${lines.join("\n")}\n${totals}\n`;
}

export function downloadExcel(summary: ReportSummary): void {
  const csv = reportToExcelCsv(summary);
  const blob = new Blob([csv], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `cep-report-${summary.title.toLowerCase().replaceAll(" ", "-")}-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function openPdfPrint(summary: ReportSummary): void {
  const rowsHtml = summary.rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.label)}</td>
        <td>${escapeHtml(row.department)}</td>
        <td>${escapeHtml(row.sales)}</td>
        <td>${escapeHtml(row.metricA)}</td>
        <td>${escapeHtml(row.metricB)}</td>
        <td>${escapeHtml(row.metricC)}</td>
        <td>${escapeHtml(row.rate)}%</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(summary.title)} — CEP Report</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; color: #111; margin: 32px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    p { color: #555; margin: 0 0 24px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid #ddd; padding: 8px 6px; text-align: left; }
    th { font-weight: 600; background: #f5f5f5; }
    tfoot td { font-weight: 600; border-top: 2px solid #111; }
    @media print { body { margin: 12mm; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(summary.title)}</h1>
  <p>${escapeHtml(summary.subtitle)}</p>
  <table>
    <thead>
      <tr>
        <th>Label</th>
        <th>Department</th>
        <th>Sales</th>
        <th>${escapeHtml(summary.columns[0])}</th>
        <th>${escapeHtml(summary.columns[1])}</th>
        <th>${escapeHtml(summary.columns[2])}</th>
        <th>${escapeHtml(summary.columns[3])}</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td></td>
        <td></td>
        <td>${escapeHtml(summary.totals.metricA)}</td>
        <td>${escapeHtml(summary.totals.metricB)}</td>
        <td>${escapeHtml(summary.totals.metricC)}</td>
        <td>${escapeHtml(summary.totals.rate)}%</td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const win = window.open(
    "",
    "_blank",
    "noopener,noreferrer,width=900,height=700",
  );
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

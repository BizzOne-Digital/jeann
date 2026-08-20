import type { AdminSectionRow } from "@/lib/admin/section-data";

export function AdminDataTable({
  columns,
  rows,
  emptyMessage,
}: {
  columns: string[];
  rows: AdminSectionRow[];
  emptyMessage: string;
}) {
  return (
    <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.key} className="border-b border-[var(--line)] last:border-0">
                {row.cells.map((cell, index) => (
                  <td key={`${row.key}-${index}`} className="px-4 py-3 align-top capitalize">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-[var(--stone)]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

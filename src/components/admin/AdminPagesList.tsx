"use client";

import Link from "next/link";

export type AdminPageListItem = {
  slug: string;
  title: string;
  path: string;
  status: string;
  sectionCount: number;
  seoTitle: string;
};

export function AdminPagesList({ pages }: { pages: AdminPageListItem[] }) {
  return (
    <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Page</th>
            <th className="px-4 py-3 font-semibold">URL</th>
            <th className="px-4 py-3 font-semibold">Sections</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.slug} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">
                <p className="font-semibold text-[var(--navy)]">{page.title}</p>
                <p className="mt-0.5 text-xs text-[var(--stone)]">{page.seoTitle}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--ocean)]">{page.path}</td>
              <td className="px-4 py-3">{page.sectionCount}</td>
              <td className="px-4 py-3 capitalize">{page.status}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="text-sm font-semibold text-[var(--navy)] underline"
                >
                  Edit sections →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

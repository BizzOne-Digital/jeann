"use client";

import Image from "next/image";
import type {
  PublicTeamFieldDefinition,
  PublicTeamMember,
} from "@/lib/content/team-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { marketingImageProps } from "@/lib/media/resolve-image-src";

function MemberPhoto({ photo, name }: { photo?: string; name: string }) {
  if (!photo?.trim()) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d5d0c8] bg-[#eef2f7] text-xs font-semibold text-[#888]"
        aria-hidden
      >
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </div>
    );
  }
  const img = marketingImageProps(photo);
  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#d5d0c8] bg-[#f3f1ec]">
      <Image
        src={img.src}
        alt={name}
        fill
        className="object-cover"
        sizes="56px"
        unoptimized={img.unoptimized}
      />
    </div>
  );
}

export function TeamRosterSection({
  members,
  fieldDefinitions,
}: {
  members: PublicTeamMember[];
  fieldDefinitions: PublicTeamFieldDefinition[];
}) {
  const roster = [...members].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  const extraFields = [...fieldDefinitions].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label),
  );

  if (roster.length === 0) {
    return (
      <Reveal>
        <div className="border border-[#d5d0c8] bg-[#f9f8f5] px-6 py-14 text-center sm:px-10">
          <p className="mx-auto max-w-lg text-sm font-semibold leading-relaxed text-[#666666]">
            Team profiles are published from the admin console — photo, name, title, and department for each
            member.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#e8e4dc] bg-[#001a3d] text-xs font-bold uppercase tracking-wide text-white">
            <tr>
              <th className="px-6 py-4">Photo</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Department</th>
              {extraFields.map((field) => (
                <th key={field.key} className="px-6 py-4">{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roster.map((member) => (
              <tr key={member.id} className="border-b border-[#eee9e0] last:border-0">
                <td className="px-6 py-5">
                  <MemberPhoto photo={member.photo} name={member.name} />
                </td>
                <td className="px-6 py-5 text-base font-bold text-[#001a3d]">{member.name}</td>
                <td className="px-6 py-5 font-bold text-[#333333]">{member.roleTitle}</td>
                <td className="px-6 py-5 font-bold text-[#555555]">{member.department || "—"}</td>
                {extraFields.map((field) => (
                  <td key={field.key} className="px-6 py-5 text-[#555555]">
                    {member.customFields[field.key]?.trim() || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#eee9e0] lg:hidden">
        {roster.map((member, index) => (
          <Reveal key={member.id} delay={index * 0.04}>
            <div className="px-5 py-5">
              <div className="flex items-start gap-4">
                <MemberPhoto photo={member.photo} name={member.name} />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#888888]">Name</p>
                  <p className="text-base font-bold text-[#001a3d]">{member.name}</p>
                  <p className="pt-2 text-xs font-bold uppercase tracking-wide text-[#888888]">Title</p>
                  <p className="text-sm font-bold text-[#c88e4a]">{member.roleTitle}</p>
                  <p className="pt-2 text-xs font-bold uppercase tracking-wide text-[#888888]">Department</p>
                  <p className="text-sm font-bold text-[#444444]">{member.department || "—"}</p>
                  {extraFields.map((field) => (
                    <div key={field.key} className="pt-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#888888]">{field.label}</p>
                      <p className="text-sm text-[#444444]">
                        {member.customFields[field.key]?.trim() || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** @deprecated Use TeamRosterSection */
export function BoardDirectorsSection({
  members,
  fieldDefinitions = [],
}: {
  members: PublicTeamMember[];
  fieldDefinitions?: PublicTeamFieldDefinition[];
}) {
  return <TeamRosterSection members={members} fieldDefinitions={fieldDefinitions} />;
}

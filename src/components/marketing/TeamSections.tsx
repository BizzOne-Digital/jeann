"use client";

import Image from "next/image";
import type { PublicTeamMember } from "@/lib/content/team-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

/** Board members only — name, position, department (client requirement). */
export function BoardDirectorsSection({ members }: { members: PublicTeamMember[] }) {
  const board = members
    .filter((m) => m.tier === "board")
    .sort((a, b) => a.name.localeCompare(b.name));

  if (board.length === 0) {
    return (
      <Reveal>
        <div className="border border-[#d5d0c8] bg-[#f9f8f5] px-6 py-14 text-center sm:px-10">
          <p className="mx-auto max-w-lg text-sm font-semibold leading-relaxed text-[#666666]">
            Board profiles are updated as appointments are announced. Each listing includes{" "}
            <strong>name</strong>, <strong>position</strong>, and <strong>department</strong>.
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
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Department</th>
            </tr>
          </thead>
          <tbody>
            {board.map((member) => (
              <tr key={member.id} className="border-b border-[#eee9e0] last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {member.photo ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#d5d0c8]">
                        <Image
                          src={resolveImageSrc(member.photo)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : null}
                    <span className="text-base font-bold text-[#001a3d]">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-[#333333]">{member.roleTitle}</td>
                <td className="px-6 py-5 font-bold text-[#555555]">{member.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#eee9e0] lg:hidden">
        {board.map((member, index) => (
          <Reveal key={member.id} delay={index * 0.04}>
            <div className="px-5 py-5">
              <div className="flex items-start gap-4">
                {member.photo ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#d5d0c8]">
                    <Image
                      src={resolveImageSrc(member.photo)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#888888]">Name</p>
                  <p className="text-base font-bold text-[#001a3d]">{member.name}</p>
                  <p className="pt-2 text-xs font-bold uppercase tracking-wide text-[#888888]">
                    Position
                  </p>
                  <p className="text-sm font-bold text-[#c88e4a]">{member.roleTitle}</p>
                  <p className="pt-2 text-xs font-bold uppercase tracking-wide text-[#888888]">
                    Department
                  </p>
                  <p className="text-sm font-bold text-[#444444]">{member.department}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

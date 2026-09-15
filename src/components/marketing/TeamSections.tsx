"use client";

import Image from "next/image";
import type { PublicTeamMember } from "@/lib/content/team-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";

export function BoardDirectorsSection({ members }: { members: PublicTeamMember[] }) {
  const board = members.filter((m) => m.tier === "board");

  if (board.length === 0) {
    return (
      <Reveal>
        <div className="border border-[#d5d0c8] bg-white px-6 py-12 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-[#001a3d] sm:text-3xl">Board of directors</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-[#666666]">
            Board profiles will appear here once published in admin (name, position, department).
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e8e4dc] bg-[#f9f8f5] text-xs font-bold uppercase tracking-wide text-[#001a3d]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Department</th>
              </tr>
            </thead>
            <tbody>
              {board.map((member) => (
                <tr key={member.id} className="border-b border-[#eee9e0] last:border-0">
                  <td className="px-6 py-4 font-bold text-[#001a3d]">{member.name}</td>
                  <td className="px-6 py-4 font-semibold text-[#333333]">{member.roleTitle}</td>
                  <td className="px-6 py-4 font-semibold text-[#555555]">{member.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#eee9e0] md:hidden">
          {board.map((member, index) => (
            <Reveal key={member.id} delay={index * 0.05}>
              <div className="flex gap-4 px-5 py-5">
                {member.photo ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#d5d0c8]">
                    <Image
                      src={resolveImageSrc(member.photo)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <p className="text-base font-bold text-[#001a3d]">{member.name}</p>
                  <p className="mt-1 text-sm font-bold text-[#c88e4a]">{member.roleTitle}</p>
                  <p className="mt-1 text-sm font-bold text-[#555555]">{member.department}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamGrid({ members }: { members: PublicTeamMember[] }) {
  const staff = members.filter((m) => m.tier !== "board");

  if (staff.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {staff.map((member, index) => (
        <Reveal key={member.id} delay={index * 0.06} y={24}>
          <article className="h-full marketing-box p-8 transition-shadow duration-300 hover:shadow-md">
            {member.photo ? (
              <div className="relative mb-5 aspect-square max-h-40 w-full overflow-hidden rounded-lg border border-[#d5d0c8]">
                <Image
                  src={resolveImageSrc(member.photo)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : null}
            <h2 className="text-xl font-bold text-[#001a3d]">{member.name}</h2>
            <p className="mt-1 text-sm font-bold text-[#c88e4a]">{member.roleTitle}</p>
            {member.bio ? (
              <p className="mt-4 text-sm leading-relaxed text-[#666666]">{member.bio}</p>
            ) : null}
          </article>
        </Reveal>
      ))}
    </div>
  );
}

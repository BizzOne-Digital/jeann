import type { PublicTeamMember } from "@/lib/content/team-catalog";

export function TeamGrid({ members }: { members: PublicTeamMember[] }) {
  if (members.length === 0) {
    return (
      <div className="border border-[#d5d0c8] bg-white px-6 py-14 text-center sm:px-10">
        <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">Team profiles coming soon</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#666666]">
          Leadership and operations profiles will appear here once published through admin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => (
        <article key={member.id} className="border border-[#d5d0c8] bg-white p-8">
          <h2 className="text-xl font-semibold text-[#001a3d]">{member.name}</h2>
          <p className="mt-1 text-sm font-medium text-[#c88e4a]">{member.roleTitle}</p>
          {member.bio ? (
            <p className="mt-4 text-sm leading-relaxed text-[#666666]">{member.bio}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

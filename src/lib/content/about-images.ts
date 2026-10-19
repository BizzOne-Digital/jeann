export function getAboutSectionImages() {
  return {
    teamStrategy: "/images/about/team-strategy-meeting.png",
    teamCollaboration: "/images/about/team-collaboration.png",
  };
}

export const ABOUT_SECTION_IMAGE_META = {
  teamStrategy: {
    src: "/images/about/team-strategy-meeting.png",
    alt: "Finekarts trade team reviewing international commodity programmes",
  },
  teamCollaboration: {
    src: "/images/about/team-collaboration.png",
    alt: "Finekarts team coordinating supply chain and quality assurance",
  },
  contactBand: {
    src: "/images/about/about-contact-meeting.png",
    alt: "Finekarts team in a collaborative trade planning meeting",
  },
} as const;

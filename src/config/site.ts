export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ligolo-ng web",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Agents",
      href: "/",
    },
    {
      label: "Interfaces",
      href: "/interfaces",
    },
    {
      label: "Listeners",
      href: "/listeners",
    },
  ],
  links: {
    github: "https://github.com/nicocha30/ligolo-ng",
    twitter: "https://twitter.com/nicocha30",
    docs: "https://nextui.org",
    sponsor: "https://github.com/sponsors/nicocha30",
  },
};

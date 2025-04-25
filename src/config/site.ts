export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ligolo-ng web",
  description: "An advanced, yet simple, tunneling tool that uses TUN interfaces.",
  navItems: [
    {
      label: "Agents",
      href: "/"
    },
    {
      label: "Interfaces",
      href: "/interfaces"
    },
    {
      label: "Listeners",
      href: "/listeners"
    }
  ],
  links: {
    github: "https://github.com/nicocha30/ligolo-ng",
    twitter: "https://twitter.com/nicocha30",
    docs: "https://docs.ligolo.ng",
    sponsor: "https://github.com/sponsors/nicocha30"
  }
};

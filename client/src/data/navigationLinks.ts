import { Home, Mail, Users, type LucideIcon } from "lucide-react";

export interface NavigationLink {
  to: string;
  label: string;
  icon?: LucideIcon;
  // match only this exact path (the list page, not its sub-pages)
  end?: boolean;
}

export const mainLinks: NavigationLink[] = [
  { to: "/subscribers", label: "Subscribers", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Mail },
  { to: "/", label: "Home", icon: Home, end: true },
];

export const sectionLinks: Record<"subscribers" | "campaigns", NavigationLink[]> =
  {
    subscribers: [
      { to: "/subscribers", label: "All subscribers", end: true },
      { to: "/subscribers/add", label: "Add subscriber" },
    ],
    campaigns: [
      { to: "/campaigns", label: "All campaigns", end: true },
      { to: "/campaigns/add", label: "Add campaign" },
    ],
  };

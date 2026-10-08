import { LayoutDashboard, Mail, MessageSquareQuote, Users, type LucideIcon } from "lucide-react";

export interface NavigationLink {
  to: string;
  label: string;
  icon: LucideIcon;
  // match only this exact path (the dashboard, not every page)
  end?: boolean;
}

// the sidebar (desktop) and the menu (phone)
export const mainLinks: NavigationLink[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/subscribers", label: "Subscribers", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Mail },
];

// about the project, not a part of it - below a line
export const projectLinks: NavigationLink[] = [
  { to: "/feedback", label: "Feedback", icon: MessageSquareQuote },
];

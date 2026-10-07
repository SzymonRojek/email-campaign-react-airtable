import { Link, NavLink } from "react-router";
import { BsGithub } from "react-icons/bs";
import { LogOut, Plus } from "lucide-react";

import { mainLinks } from "data/navigationLinks";
import ThemeToggle from "components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoMark from "components/LogoMark";
import { useLogOut } from "./useLogOut";

interface SidebarContentProps {
  // "Main" in the desktop sidebar, "Mobile" in the phone menu
  navLabel: string;
  // e.g. close the phone menu after choosing a page
  onNavigate?: () => void;
}

// logo, pages, theme and log out - the desktop sidebar and the phone menu
const SidebarContent = ({ navLabel, onNavigate }: SidebarContentProps) => {
  const logOut = useLogOut();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-md px-2 py-1"
      >
        <LogoMark />
        <span className="font-semibold tracking-tight">Email Campaign</span>
      </Link>

      <Button asChild variant="brand" className="h-9 justify-start">
        <Link to="/campaigns/add" onClick={onNavigate}>
          <Plus />
          New campaign
        </Link>
      </Button>

      <nav aria-label={navLabel} className="grid gap-1">
        {mainLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                isActive && "bg-sidebar-accent text-sidebar-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn("size-4", isActive && "text-brand")}
                  aria-hidden
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto grid gap-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            onNavigate?.();
            logOut();
          }}
          className="justify-start text-muted-foreground"
        >
          <LogOut />
          Log out
        </Button>

        <div className="flex items-center justify-between border-t px-1 pt-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Szymon Rojek</span>
          <a
            href="https://github.com/SzymonRojek/email-campaign-react-airtable"
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
            className="hover:text-foreground"
          >
            <BsGithub className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;

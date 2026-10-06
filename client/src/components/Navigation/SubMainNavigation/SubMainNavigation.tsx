import { Suspense } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { Loader } from "components/DisplayMessage";
import { sectionLinks } from "data/navigationLinks";
import { cn } from "@/lib/utils";

// tabs of a section (subscribers / campaigns) above its pages
const SubMainNavigation = () => {
  const { pathname } = useLocation();
  const section = pathname.startsWith("/campaigns") ? "campaigns" : "subscribers";

  return (
    <>
      <nav
        aria-label={section === "campaigns" ? "Campaigns" : "Subscribers"}
        className="mx-auto hidden w-full max-w-6xl gap-2 px-4 pt-6 md:flex"
      >
        {sectionLinks[section].map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10",
                isActive && "border-brand bg-brand text-brand-foreground hover:bg-brand"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {/* the pages are lazy-loaded (see Routing) */}
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default SubMainNavigation;

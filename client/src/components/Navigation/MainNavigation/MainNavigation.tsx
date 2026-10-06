import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { mainLinks } from "data/navigationLinks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "../../../img/logo.svg";
import { MobileNavigation } from "./MobileNavigation";
import { useLogOut } from "./useLogOut";

function MainNavigation() {
  const { isLogIn } = useGlobalStoreContext();
  const logOut = useLogOut();

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Email Campaign - home" className="size-10" />
          <span className="hidden text-lg font-semibold tracking-wide sm:inline">
            Email Campaign
          </span>
        </Link>

        {isLogIn && (
          <>
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {mainLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-white/10 hover:text-primary-foreground",
                      isActive && "bg-white/10 text-brand"
                    )
                  }
                >
                  {Icon && <Icon className="size-4" />}
                  {label}
                </NavLink>
              ))}
            </nav>

            <Button
              variant="brand"
              onClick={logOut}
              className="hidden md:inline-flex"
            >
              <LogOut />
              Log out
            </Button>

            <MobileNavigation />
          </>
        )}
      </div>
    </header>
  );
}

export default MainNavigation;

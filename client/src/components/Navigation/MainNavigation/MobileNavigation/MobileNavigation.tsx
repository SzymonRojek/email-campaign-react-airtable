import { NavLink } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

import { mainLinks, sectionLinks } from "data/navigationLinks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogOut } from "../useLogOut";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    "block rounded-md px-3 py-2 text-sm text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground",
    isActive && "bg-white/10 text-brand"
  );

const groups = [
  { title: "Subscribers", links: sectionLinks.subscribers },
  { title: "Campaigns", links: sectionLinks.campaigns },
];

const home = mainLinks.find(({ to }) => to === "/");

const MobileNavigation = () => {
  const logOut = useLogOut();

  return (
    <Sheet>
      <SheetTrigger
        aria-label="open menu"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-lg" }),
          "text-brand hover:bg-white/10 hover:text-brand md:hidden"
        )}
      >
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent className="w-72 border-none bg-primary text-primary-foreground">
        <SheetHeader>
          <SheetTitle className="text-brand">Menu</SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-4 px-4">
          {groups.map(({ title, links }) => (
            <div key={title}>
              <p className="px-3 pb-1 text-xs font-semibold tracking-wider text-brand uppercase">
                {title}
              </p>
              {links.map(({ to, label, end }) => (
                <SheetClose asChild key={to}>
                  <NavLink to={to} end={end} className={linkClassName}>
                    {label}
                  </NavLink>
                </SheetClose>
              ))}
            </div>
          ))}

          <Separator className="bg-white/20" />

          {home && (
            <SheetClose asChild>
              <NavLink to={home.to} end className={linkClassName}>
                {home.label}
              </NavLink>
            </SheetClose>
          )}

          <SheetClose asChild>
            <Button variant="brand" onClick={logOut}>
              <LogOut />
              Log out
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

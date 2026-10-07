import { ReactNode, useState } from "react";
import { Link } from "react-router";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoMark from "components/LogoMark";
import SidebarContent from "./SidebarContent";

// the logged-in layout: a sidebar from tablets up, a top bar with a menu on a phone
const AppShell = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r bg-sidebar text-sidebar-foreground md:block">
        <SidebarContent navLabel="Main" />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-semibold tracking-tight">Email Campaign</span>
          </Link>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label="open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Pages, theme and log out
              </SheetDescription>
              <SidebarContent
                navLabel="Mobile"
                onNavigate={() => setIsMenuOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;

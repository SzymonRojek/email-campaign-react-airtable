import Logo from "../img/logo.svg";
import { cn } from "@/lib/utils";

// the white envelope logo on a navy tile - visible on light and dark backgrounds
const LogoMark = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#142f43] ring-1 ring-black/5 dark:ring-white/10",
      className
    )}
  >
    <img src={Logo} alt="" className="size-[70%]" />
  </span>
);

export default LogoMark;

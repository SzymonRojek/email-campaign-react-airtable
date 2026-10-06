import { ReactNode } from "react";

const StyledMainContent = ({ children }: { children: ReactNode }) => (
  <div className="rounded-xl bg-white/20 p-5 backdrop-blur-md lg:px-16 lg:py-12">
    {children}
  </div>
);

export default StyledMainContent;

import { ReactNode } from "react";

const StyledContainer = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
    {children}
  </div>
);

export default StyledContainer;

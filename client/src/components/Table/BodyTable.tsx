import { ReactNode } from "react";
import { TableBody } from "@material-ui/core";

const BodyTable = ({ children }: { children: ReactNode }) => (
  <TableBody>{children}</TableBody>
);

export default BodyTable;

import { ReactNode } from "react";
import { TableCell, TableHead, TableRow } from "@material-ui/core";

import { useStylesHead } from "./styles";

const HeadTable = ({ dataHeadTable }: { dataHeadTable: ReactNode[] }) => {
  const classes = useStylesHead();

  return (
    <TableHead className={classes.tableHeader}>
      <TableRow>
        {dataHeadTable.map((cell, index) => (
          <TableCell key={`i-${index}`} className={classes.tableHeaderCell}>
            {cell}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default HeadTable;

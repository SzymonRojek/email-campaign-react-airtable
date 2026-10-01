import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Table, TableContainer } from "@material-ui/core";
import { Paper } from "@mui/material";

import { stylesContainer, useSelectStylesContainer } from "./styles";
import SelectInputConroller from "components/Inputs/SelectInputController";
import { SelectOption } from "types";

interface ContainerTableProps {
  subHeading?: string;
  setSelectValue?: (rowsNumber: number) => void;
  disableSelect?: boolean;
  passedData: unknown[];
  children: ReactNode;
}

const ContainerTable = ({
  subHeading = "",
  setSelectValue,
  disableSelect,
  passedData,
  children,
}: ContainerTableProps) => {
  const { control, watch } = useForm<{ rowsNumbers: string }>();

  const classesSelectStyles = useSelectStylesContainer();

  const selectSubscribersNumber: SelectOption[] = [
    { value: "4", label: "4" },
    { value: "6", label: "6" },
    { value: "8", label: "8" },
    { value: "10", label: "10" },
    { value: `${passedData.length}`, label: `all (${passedData.length})` },
  ];

  useEffect(() => {
    const watchNumber = watch((value) =>
      setSelectValue?.(Number(value.rowsNumbers))
    );
    return () => watchNumber.unsubscribe();
  }, [watch, setSelectValue]);

  return (
    <>
      <header style={stylesContainer.headerWrapper}>
        <p style={stylesContainer.title}>{subHeading}</p>

        {disableSelect && (
          <div style={stylesContainer.select.wrapper}>
            <p style={stylesContainer.selectText}>rows</p>

            <Paper elevation={8}>
              <SelectInputConroller
                control={control}
                name="rowsNumbers"
                defaultValue="4"
                data={selectSubscribersNumber}
                message=""
                error={false}
                classesSelectStyles={classesSelectStyles.root}
                styles={stylesContainer.textError}
              />
            </Paper>
          </div>
        )}
      </header>

      <TableContainer>
        <Table aria-label="subscribers table">{children}</Table>
      </TableContainer>
    </>
  );
};

export default ContainerTable;

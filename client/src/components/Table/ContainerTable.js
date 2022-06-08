import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Table, TableContainer } from "@material-ui/core";
import { Paper } from "@mui/material";

import { stylesContainer, useSelectStylesContainer } from "./styles";
import SelectInputConroller from "components/Inputs/SelectInputController";

const ContainerTable = ({
  subHeading,
  setSelectValue,
  disableSelect,
  passedData,
  children,
}) => {
  const { control, watch } = useForm();

  const classesSelectStyles = useSelectStylesContainer();

  const selectSubscribersNumber = [
    { value: "4", label: "4" },
    { value: "6", label: "6" },
    { value: "8", label: "8" },
    { value: "10", label: "10" },
    { value: `${passedData.length}`, label: `all (${passedData.length})` },
  ];

  useEffect(() => {
    const watchNumber = watch((value) => setSelectValue(+value.rowsNumbers));
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
                styles={stylesContainer.select}
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

ContainerTable.propTypes = {
  children: PropTypes.array,
  subHeading: PropTypes.string,
  setSelectValue: PropTypes.func,
  passedData: PropTypes.arrayOf(PropTypes.object),
  disableSelect: PropTypes.bool,
};

ContainerTable.defaultProps = { subHeading: "" };

export default ContainerTable;

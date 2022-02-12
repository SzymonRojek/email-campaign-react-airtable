import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Table, TableContainer } from "@material-ui/core";
import { Paper } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import SelectInputConroller from "components/Inputs/SelectInputController";

const useSelectStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "white",
      padding: "5px 12px",
      backgroundColor: "#142f43",
      minWidth: 20,
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#142f43",
      border: "none",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
});

const styles = {
  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  selectText: { fontSize: 16, fontWeight: "bold", letterSpacing: 2 },
  select: {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
  },
  textError: { paddingTop: 0 },
};

const ContainerTable = ({
  subHeading,
  setSelectValue,
  disableSelect,
  passedData,
  children,
}) => {
  const { control, watch } = useForm();

  const classesSelectStyles = useSelectStyles();

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
      <header style={styles.headerWrapper}>
        <p style={styles.title}>{subHeading}</p>

        {disableSelect && (
          <div style={styles.select.wrapper}>
            <p style={styles.selectText}>rows</p>

            <Paper elevation={8}>
              <SelectInputConroller
                control={control}
                name="rowsNumbers"
                styles={styles.select}
                defaultValue="4"
                data={selectSubscribersNumber}
                message=""
                error={false}
                classesSelectStyles={classesSelectStyles.root}
                styles={styles.textError}
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

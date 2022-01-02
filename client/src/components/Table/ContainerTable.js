import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Table, TableContainer } from "@material-ui/core";
import { Paper } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import SelectInputConroller from "../Inputs/SelectInputController";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "white",
      padding: "5px 10px",
      backgroundColor: "#142f43",
      width: 30,
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      border: "none",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white",
    },
    "&:hover .MuiInputLabel-root": {
      color: "white",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffa500",
    },
  },
});

const styles = {
  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  heading: { letterSpacing: 2 },
  select: {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    textError: { paddingTop: 0 },
    menuItem: {
      borderBottom: "1px solid #ddd",
    },
  },
};

const ContainerTable = ({
  subHeading,
  setSelectValue,
  disableSelect,
  passedData,
  children,
}) => {
  const { control } = useForm();

  const selectSubscribersNumber = [
    { value: "4", label: "4" },
    { value: "6", label: "6" },
    { value: "8", label: "8" },
    { value: "10", label: "10" },
    { value: `${passedData.length}`, label: `${passedData.length}` },
  ];

  return (
    <>
      <header style={styles.headerWrapper}>
        <h3 style={styles.heading}>{subHeading}</h3>

        {disableSelect && (
          <div style={styles.select.wrapper}>
            <h3 style={styles.heading}>Rows</h3>

            <Paper elevation={14}>
              <SelectInputConroller
                control={control}
                name="rowsNumbers"
                styles={styles.select}
                defaultValue="4"
                data={selectSubscribersNumber}
                setSelectValue={setSelectValue}
                message=""
                error={false}
                useStyles={useStyles}
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
  children: PropTypes.array.isRequired,
  subHeading: PropTypes.string,
};

ContainerTable.defaultProps = { subHeading: "" };

export default ContainerTable;

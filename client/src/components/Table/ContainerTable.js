import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Grid, Table, TableContainer } from "@material-ui/core";
import { Paper } from "@mui/material";

import SelectInputConroller from "../Inputs/SelectInputController";

const styles = {
  heading: { padding: "10px 0 5px 20px", letterSpacing: 2 },
  paper: {
    width: 65,
    backgroundColor: "#142F43",
  },
  select: {
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
  data,
  children,
}) => {
  const { control } = useForm();

  return (
    <>
      <Grid container>
        <Grid item xs={disableSelect ? 5 : 12} sm={8} md={9} lg={10}>
          <header>
            <h3 style={styles.heading}>{subHeading}</h3>
          </header>
        </Grid>
        {disableSelect && (
          <Grid container item xs={7} sm={4} md={3} lg={2}>
            <Grid item xs={5}>
              <h3 style={styles.heading}>Rows</h3>
            </Grid>
            <Grid item xs={7} style={{ margin: "10px 0 10px 0" }}>
              <Paper elevation={14} style={styles.paper}>
                <SelectInputConroller
                  control={control}
                  name="rowsNumbers"
                  styles={styles.select}
                  defaultValue="4"
                  data={data}
                  setSelectValue={setSelectValue}
                  message=""
                  error={false}
                />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Grid>

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

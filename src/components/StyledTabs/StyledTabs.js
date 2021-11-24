import PropTypes from "prop-types";
import { Tabs } from "@material-ui/core";
import styled from "@emotion/styled";

const StyledTabs = styled(({ ...other }) => {
  return (
    <Tabs
      {...other}
      classes={{
        flexContainer: "flexContainer",
        indicator: "indicator",
      }}
      variant="fullWidth"
      TabIndicatorProps={{ children: <span /> }}
      centered
    />
  );
})({
  "& .indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 50,
      width: "100%",
      backgroundColor: "orange",
    },
  },
  "& .flexContainer": {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

StyledTabs.propTypes = {
  other: PropTypes.object,
};

export default StyledTabs;

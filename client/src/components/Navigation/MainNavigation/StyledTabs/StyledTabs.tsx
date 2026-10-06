import { SyntheticEvent, CSSProperties } from "react";
import { Tabs, TabsProps } from "@material-ui/core";
import styled from "@emotion/styled";

// MUI v4 types onChange as an intersection with a form event handler - expose a simple one
type StyledTabsProps = Omit<TabsProps, "style" | "onChange"> & {
  style?: CSSProperties;
  onChange?: (event: SyntheticEvent, value: number) => void;
};

const StyledTabs = styled(({ style, onChange, ...other }: StyledTabsProps) => {
  return (
    <Tabs
      {...other}
      onChange={onChange as TabsProps["onChange"]}
      classes={{
        flexContainer: "flexContainer",
        indicator: "indicator",
      }}
      variant="fullWidth"
      TabIndicatorProps={{
        children: <span style={style} />,
      }}
      centered
    />
  );
})({
  "& .indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: 4,
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

export default StyledTabs;

import { useState } from "react";
import {
  AppBar,
  Typography,
  Tabs,
  Tab,
  Toolbar,
  Menu,
} from "@material-ui/core";

function NavBar() {
  const [value, setValue] = useState();

  const handleClickTab = (newValue) => setValue(newValue);

  return (
    <>
      <AppBar color="primary">
        <Toolbar>
          <Tabs
            onChange={handleClickTab}
            indicatorColor="secondary"
            value={value}
          >
            <Tab disableRipple label="subscribers" />
            <Tab disableRipple label="campaigns" />
            <Tab disableRipple label="home" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Menu></Menu>
    </>
  );
}

export default NavBar;

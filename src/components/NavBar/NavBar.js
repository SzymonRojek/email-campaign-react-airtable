import { AppBar, Typography, Tabs, Tab, Toolbar } from "@material-ui/core";

function NavBar() {
  return (
    <>
      <AppBar color="primary">
        {/* <Typography>Education</Typography> */}
        <Toolbar>
          <Tabs>
            <Tab label="subscribers" />
            <Tab label="campaigns" />
            <Tab label="home" />
          </Tabs>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;

import { useState } from "react";
import {
  AppBar,
  Typography,
  Tabs,
  Tab,
  Toolbar,
  Menu,
} from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";

function NavBar() {
  const [value, setValue] = useState();

  const handleClickTab = (newValue) => setValue(newValue);

  return (
    <>
      <AppBar color="primary">
        <Toolbar>
          <Typography>
            <GoMailRead />
          </Typography>
          <Tabs
            onChange={handleClickTab}
            indicatorColor="secondary"
            value={value}
          >
            <Link to="/subscribers">
              <Tab
                icon={<BsFillPersonPlusFill />}
                disableRipple
                label="subscribers"
              />
            </Link>
            <Link exact to="/campaigns">
              <Tab icon={<AiFillMail />} disableRipple label="campaigns" />
            </Link>
            <Link to="/">
              <Tab icon={<AiFillHome />} disableRipple label="home" />
            </Link>
          </Tabs>
        </Toolbar>
      </AppBar>

      <Menu></Menu>
    </>
  );
}

export default NavBar;

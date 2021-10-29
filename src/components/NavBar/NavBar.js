import { useEffect, useState } from "react";
import { AppBar, Typography, Tabs, Tab, Toolbar } from "@material-ui/core";
import { GoMailRead } from "react-icons/go";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router";

function NavBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState(2);

  const handleClickTab = (e, newValue) => {
    return setValue(newValue);
  };

  const navigateLinksOnReload = (value) => {
    value === 0
      ? navigate("/subscribers")
      : value === 1
      ? navigate("/campaigns")
      : navigate("/");
  };

  useEffect(() => {
    navigateLinksOnReload(value);
  }, []);

  const handleTabClick = (pageURL) => navigate(pageURL);

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
            <Tab
              icon={<BsFillPersonPlusFill />}
              disableRipple
              label="subscribers"
              onClick={() => handleTabClick("/subscribers")}
            />

            <Tab
              icon={<AiFillMail />}
              disableRipple
              label="campaigns"
              onClick={() => handleTabClick("/campaigns")}
            />

            <Tab
              icon={<AiFillHome />}
              disableRipple
              label="home"
              onClick={() => handleTabClick("/")}
            />
          </Tabs>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;

import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";

import "./styles.css";
import Menu from "../Menu/Menu";
import NavLink from "../NavLink/NavLink";

const common = {
  padding: "10px 15px",
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 1,
  textDecoration: "none",
};

const active = {
  color: "#003049",
  borderRadius: 0,
  borderBottom: "3px solid #003049",
  ...common,
};

const inactive = {
  color: "#fff",
  backgroundColor: "#003049",
  borderRadius: 4,
  ...common,
};

const Navigation = ({ dataLinks }) => (
  <>
    <Menu>
      <Grid
        style={{
          margin: "90px auto",
          maxWidth: 950,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
        container
        className="header-list"
        spacing={5}
      >
        {dataLinks.map(({ to, exact, name }) => (
          <Grid item key={name} xs={12} md={3}>
            <NavLink
              to={to}
              exact={exact}
              active={active}
              inactive={inactive}
              className="link"
            >
              {name}
            </NavLink>
          </Grid>
        ))}
      </Grid>
    </Menu>

    <div>
      <Outlet />
    </div>
  </>
);

export default Navigation;

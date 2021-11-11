import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";

import "./styles.css";
import Menu from "../Menu/Menu";
import NavLink from "../NavLink/NavLink";

const common = {
  padding: "10px 20px",
  textDecoration: "none",
  borderRadius: 4,
};

const active = {
  color: "#003049",
  border: "3px solid #003049",
  ...common,
};

const inactive = {
  color: "#fff",
  backgroundColor: "#003049",
  border: "3px solid transparent",
  ...common,
};

const Navigation = ({ dataLinks }) => (
  <>
    <Menu>
      <Grid
        style={{
          margin: "90px auto",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
        container
        className="header-list"
        spacing={4}
      >
        {dataLinks.map(({ to, exact, name }) => (
          <Grid item key={name} xs={12} md={3}>
            <NavLink
              to={to}
              exact={exact}
              active={active}
              inactive={inactive}
              name={name}
            />
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

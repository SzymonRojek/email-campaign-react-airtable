import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";

import Menu from "../Menu/Menu";
import NavLink from "../NavLink/NavLink";

const common = {
  textDecoration: "none",
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: 175,
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
  <Container>
    <Menu>
      <Grid
        container
        spacing={1}
        style={{
          margin: "100px auto",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dataLinks.map(({ to, exact, name }, i) => (
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
  </Container>
);

export default Navigation;

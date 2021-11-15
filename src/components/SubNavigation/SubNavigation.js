import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";

import StyledLink from "./StyledLink";

const SubNavigation = ({ dataLinks }) => (
  <Container>
    <nav>
      <Grid
        container
        rowSpacing={{ xs: 1 }}
        style={{
          margin: "20px auto",
          maxWidth: 400,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {dataLinks.map(({ to, exact, name }, index) => (
          <Grid item key={index} xs={12} md={3}>
            <StyledLink to={to} exact={exact}>
              {name}
            </StyledLink>
          </Grid>
        ))}
      </Grid>
    </nav>

    <div>
      <Outlet />
    </div>
  </Container>
);
export default SubNavigation;

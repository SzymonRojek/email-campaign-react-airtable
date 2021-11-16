import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import StyledLink from "./StyledLink";

const SubNavigation = ({ dataLinks }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {!isMobile ? (
        <Container>
          <nav>
            <Grid
              container
              style={{
                margin: "20px auto",
                maxWidth: 400,
              }}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {dataLinks.map(({ to, exact, name }, index) => (
                <Grid item key={index} md={3}>
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
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};
export default SubNavigation;

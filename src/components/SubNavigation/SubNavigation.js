import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import StyledLink from "./StyledLink";

const styleGrid = { margin: "10px auto", maxWidth: 400 };

const SubNavigation = ({ dataLinks }) => {
  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {!isSmallDevice ? (
        <Container>
          <nav>
            <Grid
              container
              style={styleGrid}
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

import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button } from "@mui/material";
import { AddSubscriber } from ".";

const Subscribers = () => (
  <>
    <Switch>
      <Route
        exact
        path="/add-subscriber"
        render={() => {
          return <AddSubscriber />;
        }}
      />

      <Route
        exact
        path="/"
        render={() => (
          <>
            <p>Subscribers</p>

            <Button
              component={RouterLink}
              to="/add-subscriber"
              variant="contained"
              color="primary"
            >
              Add New Subsribers
            </Button>
          </>
        )}
      />
    </Switch>
  </>
);

export default Subscribers;

import { useEffect, useState } from "react";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button, Box } from "@mui/material";

import AddSubscriber from "./AddSubscriber";
import { SubscribersList } from "../components/SubscribersList";

import api from "./../api";

const Subscribers = () => {
  const [dataSubscribers, setDataSubscribers] = useState([]);
  const endpoint = "/subscribers";

  const getData = async () => {
    const data = await api.get(endpoint);
    setDataSubscribers(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Switch>
        <Route exact path="/add-subscriber" render={() => <AddSubscriber />} />

        <Route
          exact
          path="/"
          render={() => (
            <>
              <SubscribersList dataSubscribers={dataSubscribers} />

              <Box px={3} py={4} mt={3}>
                <Button
                  component={RouterLink}
                  to="/add-subscriber"
                  variant="contained"
                  color="secondary"
                >
                  Add New Subscribers
                </Button>
              </Box>
            </>
          )}
        />
      </Switch>
    </>
  );
};

export default Subscribers;

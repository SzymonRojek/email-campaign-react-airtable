import { useEffect, useState } from "react";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button } from "@mui/material";

import AddSubscriber from "./AddSubscriber";
import { SubscribersTable } from "../components/SubscribersTable";

import api from "./../api";

const Subscribers = () => {
  const [dataSubscribers, setDataSubscribers] = useState([]);
  const endpoint = "/subscribers";

  const getData = async () => {
    const data = await api.get(endpoint).catch((err) => {
      console.log(err);
    });
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
              <SubscribersTable dataSubscribers={dataSubscribers} />

              <Button
                component={RouterLink}
                to="/add-subscriber"
                variant="contained"
                color="secondary"
              >
                Add New Subscribers
              </Button>
            </>
          )}
        />
      </Switch>
    </>
  );
};

export default Subscribers;

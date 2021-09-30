import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { AddSubscriber } from ".";
import { apiConfig, getSubscribers } from "./../api/api";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { SubscribersTable } from "../components/SubscribersTable";

const Subscribers = () => {
  const [dataSubscribers, setDataSubscribers] = useState([]);
  const { subscribers } = apiConfig;

  const getData = async () => {
    const data = await getSubscribers(subscribers);
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
                Add New Subsribers
              </Button>
            </>
          )}
        />
      </Switch>
    </>
  );
};

export default Subscribers;

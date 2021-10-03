import { useEffect, useState } from "react";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";

import { Button, Box } from "@mui/material";
import AddSubscriber from "./AddSubscriber";

import { SubscribersList } from "../components/SubscribersList";
import { Popup } from "../components/Popup";
import SubscriberDetails from "./SubscriberDetails";
import api from "./../api";

const Subscribers = () => {
  const [dataSubscribers, setDataSubscribers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [textContentPopup, setContentPopup] = useState("");

  const endpoint = "/subscribers";

  const getData = async () => {
    const data = await api.get(endpoint);
    setDataSubscribers(data.records);
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
          path="/subscribers/:id"
          render={(props) => <SubscriberDetails {...props} />}
        />

        <Route exact path="/subscribers">
          <SubscribersList
            dataSubscribers={dataSubscribers}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            setContentPopup={setContentPopup}
          />

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              component={RouterLink}
              to="/add-subscriber"
              variant="contained"
              color="secondary"
            >
              Add New Subscribers
            </Button>
          </Box>
        </Route>
      </Switch>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        textContentPopup={textContentPopup}
      />
    </>
  );
};

export default Subscribers;

import { useEffect, useState } from "react";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button, Box } from "@mui/material";

import api from "./../api";
import AddSubscriber from "./AddSubscriber";
import SubscriberDetails from "./SubscriberDetails";
import { SubscribersList } from "../components/SubscribersList";
import { InfoPopup, ConfirmPopup } from "../components/Popup";
import { sortDataAlphabetically } from "../helpers";

const Subscribers = () => {
  const [subscribersData, setSubscribersData] = useState([]);
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [textContentPopup, setContentPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [idClickedSubscriber, setIdClickedSubscriber] = useState("");

  const endpoint = "/subscribers";

  const getData = async () => {
    const data = await api.get(endpoint);
    sortDataAlphabetically(data.records);
    setSubscribersData(data.records);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRemoveSubscriber = async () => {
    const removeSubscriber = subscribersData.filter(
      (subscriber) => subscriber.id === idClickedSubscriber
    )[0].id;

    await api.delete(`/subscribers/${removeSubscriber}`);
    getData();

    setOpenConfirmPopup(false);
  };

  return (
    <>
      <Switch>
        <Route exact path="/add-subscriber">
          <AddSubscriber
            openInfoPopup={openInfoPopup}
            setOpenInfoPopup={setOpenInfoPopup}
            setContentPopup={setContentPopup}
          />
        </Route>

        <Route
          exact
          path="/subscribers/:id"
          render={(props) => <SubscriberDetails {...props} />}
        />

        <Route exact path="/subscribers">
          <SubscribersList
            subscribersData={subscribersData}
            setOpenInfoPopup={setOpenInfoPopup}
            setOpenConfirmPopup={setOpenConfirmPopup}
            setContentPopup={setContentPopup}
            setIdClickedSubscriber={setIdClickedSubscriber}
          />

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              component={RouterLink}
              to="/add-subscriber"
              variant="contained"
              color="secondary"
            >
              Add New Subscriber
            </Button>
          </Box>
        </Route>
      </Switch>

      <InfoPopup
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
        textContentPopup={textContentPopup}
      />

      <ConfirmPopup
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
        idClickedSubscriber={idClickedSubscriber}
        setIdClickedSubscriber={setIdClickedSubscriber}
        removeSubscriber={handleRemoveSubscriber}
      />
    </>
  );
};

export default Subscribers;

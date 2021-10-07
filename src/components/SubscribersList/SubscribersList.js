import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button, Box } from "@mui/material";

import { capitalizeFirstLetter, setTextPopup } from "./../../helpers";
import handlers from "./../../helpers/handlers";
import FilteredStatusSubscribers from "./FilteredStatusSubscribers";
import UnfilteredSubscribersList from "./UnfilteredSubscribersList";

const dataTableCell = [
  "No",
  "Name",
  "Surname",
  "Profession",
  "Status",
  "Created",
  "Details",
  "Delete",
];

const SubscribersList = (props) => {
  const {
    subscribersData,
    setContentPopup,
    setOpenInfoPopup,
    setOpenConfirmPopup,
    setIdClickedSubscriber,
    removeSubscriber,
  } = props;
  const history = useHistory();

  const handlePopup = (subscriber) => {
    handlers.handleRowClick(subscriber, history);
    setTextPopup(
      subscriber.fields.status,
      capitalizeFirstLetter(subscriber.fields.name),
      setContentPopup
    );
    handlers.handleOpenPopup(subscriber, setOpenInfoPopup);
  };

  return (
    <Switch>
      <Route
        exact
        path="/filtered-status"
        render={() => (
          <>
            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="active"
              handlePopup={handlePopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
              removeSubscriber={removeSubscriber}
            />

            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="pending"
              handlePopup={handlePopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
              removeSubscriber={removeSubscriber}
            />

            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="blocked"
              handlePopup={handlePopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
              removeSubscriber={removeSubscriber}
            />
          </>
        )}
      />

      <Route
        exact
        path="/subscribers"
        render={() => (
          <>
            <UnfilteredSubscribersList
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              handlePopup={handlePopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
              removeSubscriber={removeSubscriber}
            />

            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                component={RouterLink}
                to="/filtered-status"
                variant="contained"
                color="secondary"
              >
                Filter By Status
              </Button>
            </Box>
          </>
        )}
      />
    </Switch>
  );
};

export default SubscribersList;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??
// check the head of the table - it is a differ betwen head and table container => fix it!
// in the Pop use the function capitalize

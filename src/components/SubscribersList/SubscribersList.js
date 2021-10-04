import { TableCell } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { ContainerTable, HeadTable, BodyTable } from "../common/Table";
import { RowSubscriber } from "../common/Table";
import { setTextPopup } from "./../../helpers";
import handlers from "./../../helpers/handlers";

const dataTableCell = ["No", "Name", "Surname", "Email", "Status", "Created"];

const SubscribersList = ({
  subscribersData,
  setContentPopup,
  setOpenPopup,
}) => {
  const history = useHistory();

  const runHandlersClick = (subscriber) => {
    handlers.handleRowClick(subscriber, history);
    setTextPopup(
      subscriber.fields.status,
      subscriber.fields.name,
      setContentPopup
    );
    handlers.handleOpenPopup(subscriber, setOpenPopup);
  };

  return (
    <>
      {subscribersData.some((el) => el.fields.status === "active") && (
        <ContainerTable>
          <HeadTable data={dataTableCell} />

          <BodyTable>
            {subscribersData &&
              subscribersData
                .filter((subscriber) => subscriber.fields.status === "active")
                .map((subscriber, index) => (
                  <RowSubscriber
                    children={
                      <TableCell component="th" scope="row">
                        {++index}.
                      </TableCell>
                    }
                    key={`id-${subscriber.id}`}
                    subscriber={subscriber}
                    index={index}
                    setContentPopup={setContentPopup}
                    setOpenPopup={setOpenPopup}
                    onClick={() => runHandlersClick(subscriber)}
                  />
                ))}
          </BodyTable>
        </ContainerTable>
      )}

      {subscribersData.some((el) => el.fields.status === "pending") && (
        <ContainerTable>
          <HeadTable data={dataTableCell} />

          <BodyTable>
            {subscribersData &&
              subscribersData
                .filter((subscriber) => subscriber.fields.status === "pending")
                .map((subscriber, index) => (
                  <RowSubscriber
                    children={
                      <TableCell component="th" scope="row">
                        {++index}.
                      </TableCell>
                    }
                    key={`id-${subscriber.id}`}
                    subscriber={subscriber}
                    index={index}
                    setContentPopup={setContentPopup}
                    setOpenPopup={setOpenPopup}
                    onClick={() => runHandlersClick(subscriber)}
                  />
                ))}
          </BodyTable>
        </ContainerTable>
      )}

      {subscribersData.some((el) => el.fields.status === "blocked") && (
        <ContainerTable>
          <HeadTable data={dataTableCell} />

          <BodyTable>
            {subscribersData &&
              subscribersData
                .filter((subscriber) => subscriber.fields.status === "blocked")
                .map((subscriber, index) => (
                  <RowSubscriber
                    children={
                      <TableCell component="th" scope="row">
                        {++index}.
                      </TableCell>
                    }
                    key={`id-${subscriber.id}`}
                    subscriber={subscriber}
                    index={index}
                    setContentPopup={setContentPopup}
                    setOpenPopup={setOpenPopup}
                    onClick={() => runHandlersClick(subscriber)}
                  />
                ))}
          </BodyTable>
        </ContainerTable>
      )}
    </>
  );
};

export default SubscribersList;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??

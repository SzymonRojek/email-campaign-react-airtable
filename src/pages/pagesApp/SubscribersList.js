import { TableCell } from "@material-ui/core";
import { useEffect, useState } from "react";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  RowSubscriber,
} from "../../components/Table";
import { generalDataHeadTable } from "../../data/dataHeadTable";
import { getLatestAddedSubscriber } from "../../helpers";

const SubscribersList = ({
  subscribersData,
  setOpenConfirmPopup,
  handlePopup,
  setIdClickedSubscriber,
}) => {
  const [latestAddedSubscriber, setLatestAddedSubscriber] = useState();

  useEffect(() => {
    setLatestAddedSubscriber(getLatestAddedSubscriber(subscribersData));
  }, []);

  return (
    <>
      <ContainerTable>
        <HeadTable data={generalDataHeadTable} />

        <BodyTable>
          {subscribersData &&
            subscribersData.map((subscriber, index) => (
              <RowSubscriber
                children={
                  <TableCell component="th" scope="row">
                    {++index}.
                  </TableCell>
                }
                key={`id-${subscriber.id}`}
                subscriber={subscriber}
                index={index}
                setOpenConfirmPopup={setOpenConfirmPopup}
                handlePopup={handlePopup}
                setIdClickedSubscriber={setIdClickedSubscriber}
              />
            ))}
        </BodyTable>
      </ContainerTable>

      <h2 style={{ textAlign: "center", marginBottom: -40, color: "#303f9f" }}>
        Latest added subscriber:
      </h2>
      <ContainerTable>
        <HeadTable data={generalDataHeadTable} />

        <BodyTable>
          {latestAddedSubscriber &&
            latestAddedSubscriber.map((subscriber, index) => (
              <RowSubscriber
                children={
                  <TableCell component="th" scope="row">
                    {++index}.
                  </TableCell>
                }
                key={`id-${subscriber.id}`}
                subscriber={subscriber}
                index={index}
                setOpenConfirmPopup={setOpenConfirmPopup}
                handlePopup={handlePopup}
                setIdClickedSubscriber={setIdClickedSubscriber}
              />
            ))}
        </BodyTable>
      </ContainerTable>
    </>
  );
};
export default SubscribersList;

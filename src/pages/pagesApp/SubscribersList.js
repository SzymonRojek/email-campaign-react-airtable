import { TableCell } from "@material-ui/core";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  RowSubscriber,
} from "../../components/Table";
import { generalDataHeadTable } from "../../data/dataHeadTable";

const SubscribersList = ({
  subscribersData,
  setOpenConfirmPopup,
  handlePopup,
  setIdClickedSubscriber,
}) => (
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
);

export default SubscribersList;

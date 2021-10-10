import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable, RowSubscriber } from "../Table";

const ContainerTableSubscribers = ({
  dataHeadTable,
  subscribersData,
  setOpenConfirmPopup,
  handlePopup,
  setIdClickedSubscriber,
}) => (
  <ContainerTable>
    <HeadTable dataHeadTable={dataHeadTable} />

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

export default ContainerTableSubscribers;

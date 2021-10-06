import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../common/Table";
import { RowSubscriber } from "../common/Table";

const UnfilteredSubscribersList = (props) => {
  const { dataTableCell, subscribersData, handlePopup, removeSubscriber } =
    props;

  return (
    <ContainerTable>
      <HeadTable data={dataTableCell} />

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
              handlePopup={handlePopup}
              removeSubscriber={removeSubscriber}
            />
          ))}
      </BodyTable>
    </ContainerTable>
  );
};

export default UnfilteredSubscribersList;

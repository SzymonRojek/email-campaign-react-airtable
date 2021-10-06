import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../common/Table";
import { RowSubscriber } from "../common/Table";

const FilteredStatusSubscribers = (props) => {
  const {
    subscribersData,
    dataTableCell,
    status,
    handlePopup,
    removeSubscriber,
  } = props;

  return (
    subscribersData &&
    subscribersData.some((el) => el.fields.status === status) && (
      <ContainerTable>
        <HeadTable data={dataTableCell} />

        <BodyTable>
          {subscribersData &&
            subscribersData
              .filter((subscriber) => subscriber.fields.status === status)
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
                  onClick={() => handlePopup(subscriber)}
                  removeSubscriber={removeSubscriber}
                />
              ))}
        </BodyTable>
      </ContainerTable>
    )
  );
};

export default FilteredStatusSubscribers;

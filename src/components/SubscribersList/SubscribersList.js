import { TableCell } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { ContainerTable, HeadTable, BodyTable } from "../common/Table";
import { RowSubscriber } from "../common/Table";
import { setTextPopup } from "./../../helpers";

const dataTableCell = ["No", "Name", "Surname", "Email", "Status", "Created"];

const SubscribersList = ({
  subscribersData,
  setContentPopup,
  setOpenPopup,
}) => {
  const history = useHistory();

  return (
    <ContainerTable>
      <HeadTable data={dataTableCell} />

      <BodyTable>
        {subscribersData &&
          subscribersData.map((subscriber, index) => {
            const handleRowClick = () =>
              subscriber.fields.status === "active"
                ? history.push(`/subscribers/${subscriber.id}`)
                : "";

            const handleOpenPopup = () =>
              subscriber.fields.status === "pending" ||
              subscriber.fields.status === "blocked"
                ? setOpenPopup(true)
                : null;

            return (
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
                onClick={() => {
                  handleRowClick();
                  setTextPopup(
                    subscriber.fields.status,
                    subscriber.fields.name,
                    setContentPopup
                  );
                  handleOpenPopup();
                }}
              />
            );
          })}
      </BodyTable>
    </ContainerTable>
  );
};

export default SubscribersList;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??

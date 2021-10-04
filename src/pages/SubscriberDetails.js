import { useEffect, useState } from "react";
import { TableBody } from "@material-ui/core";

import api from "../api";
import {
  ContainerTable,
  HeadTable,
  RowSubscriber,
} from "../components/common/Table";

const SubscriberDetails = ({ match }) => {
  const [subscriberData, setSubscriberData] = useState([]);

  const id = match.params.id;
  const endpoint = `/subscribers/${id}`;

  const getSubscriber = async () => {
    const data = await api.get(endpoint);
    setSubscriberData([data]);
  };

  useEffect(() => {
    getSubscriber();
  }, []);

  const dataTableCell = ["Name", "Surname", "Email", "Status", "Created"];
  return (
    <ContainerTable>
      <HeadTable data={dataTableCell} />

      <TableBody>
        {subscriberData &&
          subscriberData.map((subscriber, index) => (
            <RowSubscriber
              key={`id-${subscriber.id}`}
              subscriber={subscriber}
              index={index}
            />
          ))}
      </TableBody>
    </ContainerTable>
  );
};

export default SubscriberDetails;

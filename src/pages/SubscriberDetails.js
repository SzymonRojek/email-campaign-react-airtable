import { useEffect, useState } from "react";

import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import api from "../api";
import {
  ContainerTable,
  HeadTable,
  RowSubscriber,
} from "../components/common/Table";

const SubscriberDetails = ({ match }) => {
  const [subscriberData, setSubscriberData] = useState(null);

  const id = match.params.id;
  const endpoint = `/subscribers/${id}`;

  const getSubscriber = async () => {
    const data = await api.get(endpoint);
    setSubscriberData([data]);
  };

  useEffect(() => {
    getSubscriber();
  }, []);

  const generalDataHeadTable = [
    "Name",
    "Surname",
    "Email",
    "Status",
    "Created",
  ];

  const detailsDataHeadTable = ["Profession", "Salary", "Telephone", "Address"];

  return (
    <>
      <ContainerTable>
        <HeadTable data={generalDataHeadTable} />

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

      {/* Table Subscriber Details */}
      <ContainerTable>
        <HeadTable data={detailsDataHeadTable} />

        <TableBody>
          {subscriberData &&
            subscriberData.map((subscriber, index) => (
              <TableRow key={`i-${index}`}>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields.profession}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields.salary}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields.telephone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields.address}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </ContainerTable>
    </>
  );
};

export default SubscriberDetails;

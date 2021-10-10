import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import api from "../api";
import { ContainerTable, HeadTable, RowSubscriber } from "../components/Table";

const SubscriberDetails = () => {
  const { id } = useParams();
  const [subscriberData, setSubscriberData] = useState(null);

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
    "Profession",
    "Status",
    "Created",
  ];

  const detailsDataHeadTable = ["Email", "Salary", "Telephone", "Address"];

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginTop: 100,
          fontSize: 40,
          color: "#303f9f",
          letterSpacing: 2,
          wordSpacing: 15,
        }}
      >
        Subscriber Details
      </h1>
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

      <ContainerTable>
        <HeadTable data={detailsDataHeadTable} />
        <TableBody>
          {subscriberData &&
            subscriberData.map((subscriber, index) => (
              <TableRow key={`i-${index}`}>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields?.salary}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields?.telephone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {subscriber.fields?.address}
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

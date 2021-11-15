import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import api from "../../api";
import {
  ContainerTable,
  HeadTable,
  RowSubscriber,
} from "../../components/Table";
import {
  detailsDataHeadTableFirst,
  detailsDataHeadTableSecond,
} from "../../data/dataHeadTable";
import { Loader } from "../../components/Loader";
import { StyledHeading } from "../../components/StyledHeading";

const SubscriberDetails = () => {
  const [subscriberData, setSubscriberData] = useState({
    status: "loading",
    data: null,
  });
  const { id } = useParams();
  const endpoint = `/subscribers/${id}`;

  const getSubscriberData = async () => {
    try {
      const data = await api.get(endpoint);

      setSubscriberData({ status: "success", data });
    } catch (error) {
      setSubscriberData({ status: "error" });
    }
  };

  useEffect(() => {
    const delayGetData = setTimeout(getSubscriberData, 3_000);

    return () => clearTimeout(delayGetData);
  }, []);

  return (
    <>
      {subscriberData.status === "loading" ? (
        <Loader title={`Subscriber's`} />
      ) : (
        <>
          <StyledHeading label="Subscribers Details:" />

          <ContainerTable subHeading="General:">
            <HeadTable dataHeadTable={detailsDataHeadTableFirst} />

            <TableBody>
              {subscriberData &&
                [subscriberData.data].map((subscriber, index) => (
                  <RowSubscriber
                    key={`id-${subscriber.id}`}
                    index={index}
                    subscriber={subscriber}
                  />
                ))}
            </TableBody>
          </ContainerTable>

          <ContainerTable subHeading="Details:">
            <HeadTable dataHeadTable={detailsDataHeadTableSecond} />

            <TableBody>
              {subscriberData &&
                [subscriberData.data].map((subscriber, index) => (
                  <TableRow key={`i-${index}`}>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle1">
                        {subscriber.fields?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle1">
                        {subscriber.fields?.salary}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle1">
                        {subscriber.fields?.telephone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="subtitle1">
                        {subscriber.fields?.address}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </ContainerTable>
        </>
      )}
    </>
  );
};

export default SubscriberDetails;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import api from "../api";
import { ContainerTable, HeadTable, RowSubscriber } from "../components/Table";
import {
  detailsDataHeadTableFirst,
  detailsDataHeadTableSecond,
} from "../data/dataHeadTable";
import { Loader } from "../components/Loader";

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
    const delayGetData = setTimeout(getSubscriberData, 1_000);

    return () => clearTimeout(delayGetData);
  }, []);

  return (
    <div style={{ margin: 20 }}>
      {subscriberData.status === "loading" ? (
        <Loader title={`Subscriber's details are loading...`} />
      ) : (
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

          <ContainerTable>
            <HeadTable dataHeadTable={detailsDataHeadTableSecond} />

            <TableBody>
              {subscriberData &&
                [subscriberData.data].map((subscriber, index) => (
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
      )}
    </div>
  );
};

export default SubscriberDetails;

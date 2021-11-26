import { useParams } from "react-router-dom";
import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container,
} from "@material-ui/core";

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
import { Error } from "../../components/Error";
import { StyledHeading } from "../../components/StyledHeading";
import { useFetchDetailsById } from "../../useFetchDetailsById";

const SubscriberDetails = () => {
  const { id } = useParams();
  const endpoint = `/subscribers/${id}`;
  const { itemData } = useFetchDetailsById(endpoint);

  return (
    <>
      {itemData.status === "loading" ? (
        <Loader title="Subscriber" />
      ) : itemData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      ) : (
        <Container>
          <>
            <StyledHeading label="Subscribers Details:" />

            <ContainerTable subHeading="General:">
              <HeadTable dataHeadTable={detailsDataHeadTableFirst} />

              <TableBody>
                {itemData &&
                  [itemData.data].map((subscriber, index) => (
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
                {itemData &&
                  [itemData.data].map((subscriber, index) => (
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
        </Container>
      )}
    </>
  );
};

export default SubscriberDetails;

import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container,
} from "@material-ui/core";

import { ContainerTable, HeadTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import {
  detailsDataHeadTableFirst,
  detailsDataHeadTableSecond,
} from "data/dataHeadTable";
import { Loader, Error } from "components/DisplayMessage";
import { StyledHeading } from "components/StyledHeading";
import { useFetchDetailsById } from "useFetchDetailsById";

const SubscriberDetails = ({ subscribersData }) => {
  const { id } = useParams();
  const endpoint = `/subscribers/${id}`;

  const { itemData } = useFetchDetailsById(endpoint);

  // check if Campaign's id is available, otherwise return Error
  let isIdCorrect = null;

  if (id !== undefined && subscribersData.data !== null) {
    isIdCorrect = Boolean(subscribersData.data.find((item) => item.id === id));
  }

  if (isIdCorrect === false || itemData.status === "error") {
    return (
      <Error
        titleOne="Unfortunately, Subscriber does not exist."
        titleTwo="Check the url address."
        titleThree="Back to Subscribers."
      />
    );
  }

  return (
    <>
      {itemData.status === "loading" ? (
        <Loader title="Subscriber" />
      ) : (
        <Container>
          <>
            <StyledHeading label="Subscribers Details:" />

            <ContainerTable subHeading="General:">
              <HeadTable dataHeadTable={detailsDataHeadTableFirst} />

              <TableBody>
                {itemData &&
                  [itemData.data].map((subscriber, index) => (
                    <SubscriberTableRow
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

SubscriberDetails.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    latestAddedItem: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default SubscriberDetails;

// import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import { useFetchDetailsById } from "useFetchDetailsById";
import {
  detailsDataHeadTableFirst,
  detailsDataHeadTableSecond,
} from "data/dataHeadTable";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { ContainerTable, HeadTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import { Loader, Error } from "components/DisplayMessage";
import SubscribersList from "../../components/SubscribersList/SubscribersList";

const SubscriberDetailsPage = ({ subscribersData }) => {
  const { id } = useParams();
  const endpoint = `/subscribers/${id}`;
  const { itemData: subscriberData } = useFetchDetailsById(endpoint);

  return (
    <>
      {subscriberData && subscriberData.status === "loading" ? (
        <Loader title="Subscriber" />
      ) : !Boolean(
          subscribersData.data &&
            subscribersData.data.find((item) => item.id === id)
        ) ? (
        <Error
          titleOne="Unfortunately, this Subscriber does not exist"
          titleTwo="Check the url address"
          titleThree="Back to Subscribers List"
        />
      ) : (
        <StyledContainer>
          <StyledHeading label="Subscriber Details" />

          <SubscribersList
            subHeading="General data"
            dataHeadTable={detailsDataHeadTableFirst}
            passedData={[subscriberData.data]}
          />

          {/* <ContainerTable subHeading="Details:">
            <HeadTable dataHeadTable={detailsDataHeadTableSecond} /> */}

          {/* <TableBody>
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
                  </TableRow>
                ))}
            </TableBody> */}
          {/* </ContainerTable> */}
        </StyledContainer>
      )}
    </>
  );
};

// SubscriberDetailsPage.propTypes = {
//   subscribersData: PropTypes.shape({
//     status: PropTypes.string,
//     data: PropTypes.arrayOf(PropTypes.object),
//   }),
// };

export default SubscriberDetailsPage;

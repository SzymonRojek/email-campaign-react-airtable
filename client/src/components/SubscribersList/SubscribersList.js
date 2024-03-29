import PropTypes from "prop-types";
import { useState } from "react";
import { Typography } from "@mui/material";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberGeneralData } from "components/SubscriberTableRow/SubscriberGeneralData";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const SubscribersList = (props) => {
  const {
    subHeading,
    dataHeadTable,
    passedData,
    editSubscriber,
    handleSubscriberDetails,
  } = props;
  const [selectValue, setSelectValue] = useState(4);

  return (
    <CustomPaginator
      passedData={passedData}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <>
          {data && data.length === 0 ? (
            <Typography color="textSecondary" variant="subtitle1" p={2}>
              Actually the list of subscribers is empty - please add new
              subscriber.
            </Typography>
          ) : (
            <ContainerTable
              subHeading={subHeading}
              passedData={passedData}
              setSelectValue={setSelectValue}
              disableSelect={passedData.length > 4 ? true : false}
            >
              <HeadTable dataHeadTable={dataHeadTable} />

              <BodyTable>
                {data.map((subscriber, index) => (
                  <SubscriberGeneralData
                    key={`id-${subscriber.id}`}
                    subscriber={subscriber}
                    index={index}
                    actualPage={actualPage}
                    dataPerPage={parseInt(selectValue)}
                    editSubscriber={editSubscriber}
                    handleSubscriberDetails={handleSubscriberDetails}
                  />
                ))}
              </BodyTable>
            </ContainerTable>
          )}
        </>
      )}
    />
  );
};
SubscribersList.propTypes = {
  subHeading: PropTypes.string,
  dataHeadTable: PropTypes.array,
  passedData: PropTypes.arrayOf(PropTypes.object),
  handleSubscriberDetails: PropTypes.func,
  editSubscriber: PropTypes.func,
};

export default SubscribersList;

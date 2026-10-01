import { ReactNode, useState } from "react";
import { Typography } from "@mui/material";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberGeneralData } from "components/SubscriberTableRow/SubscriberGeneralData";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { Subscriber } from "types";

interface SubscribersListProps {
  subHeading: string;
  dataHeadTable: ReactNode[];
  passedData: Subscriber[];
  editSubscriber?: (subscriber: Subscriber) => void;
  handleSubscriberDetails?: (subscriber: Subscriber) => void;
}

const SubscribersList = ({
  subHeading,
  dataHeadTable,
  passedData,
  editSubscriber,
  handleSubscriberDetails,
}: SubscribersListProps) => {
  const [selectValue, setSelectValue] = useState(4);

  return (
    <CustomPaginator
      passedData={passedData}
      dataPerPage={selectValue}
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
              disableSelect={passedData.length > 4}
            >
              <HeadTable dataHeadTable={dataHeadTable} />

              <BodyTable>
                {data.map((subscriber, index) => (
                  <SubscriberGeneralData
                    key={`id-${subscriber.id}`}
                    subscriber={subscriber}
                    index={index}
                    actualPage={actualPage}
                    dataPerPage={selectValue}
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

export default SubscribersList;

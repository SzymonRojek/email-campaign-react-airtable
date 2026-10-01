import { ReactNode, useState } from "react";
import { Typography } from "@mui/material";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  FooterText,
} from "components/Table";
import { SubscriberGeneralData } from "components/SubscriberTableRow/SubscriberGeneralData";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { getFilteredDataByStatus } from "helpers";
import { Subscriber } from "types";

interface SubscriberStatusProps {
  subHeading: string;
  generalDataHeadTable: ReactNode[];
  passedData?: Subscriber[];
  editSubscriber?: (subscriber: Subscriber) => void;
  handleSubscriberDetails?: (subscriber: Subscriber) => void;
  status: string;
}

const SubscriberStatus = ({
  subHeading,
  generalDataHeadTable,
  passedData,
  editSubscriber,
  handleSubscriberDetails,
  status,
}: SubscriberStatusProps) => {
  const [selectValue, setSelectValue] = useState(4);

  const filteredData = getFilteredDataByStatus(passedData, status);

  return (
    <CustomPaginator
      passedData={filteredData}
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
            <>
              <ContainerTable
                subHeading={subHeading}
                passedData={filteredData}
                setSelectValue={setSelectValue}
                disableSelect={filteredData.length > 4}
              >
                <HeadTable dataHeadTable={generalDataHeadTable} />

                <BodyTable>
                  {data.some((el) => el.fields.status === status)
                    ? data.map((subscriber, index) => (
                        <SubscriberGeneralData
                          key={`id-${subscriber.id}`}
                          subscriber={subscriber}
                          index={index}
                          actualPage={actualPage}
                          dataPerPage={selectValue}
                          editSubscriber={editSubscriber}
                          handleSubscriberDetails={handleSubscriberDetails}
                        />
                      ))
                    : []}
                </BodyTable>
              </ContainerTable>
              {filteredData.length < 1 ? (
                <FooterText
                  text="There are not subscribers with the status - "
                  status={status}
                />
              ) : null}
            </>
          )}
        </>
      )}
    />
  );
};

export default SubscriberStatus;

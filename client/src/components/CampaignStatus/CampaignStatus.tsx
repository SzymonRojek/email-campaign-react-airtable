import { ReactNode, useState } from "react";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  FooterText,
} from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { getFilteredDataByStatus } from "helpers";
import { Campaign } from "types";

interface CampaignStatusProps {
  subHeading: string;
  dataHeadEmailTable: ReactNode[];
  passedData?: Campaign[];
  status: string;
  editCampaign: (campaign: Campaign) => void;
}

const CampaignStatus = ({
  subHeading,
  dataHeadEmailTable,
  passedData,
  status,
  editCampaign,
}: CampaignStatusProps) => {
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
          <ContainerTable
            subHeading={subHeading}
            passedData={filteredData}
            setSelectValue={setSelectValue}
            disableSelect={filteredData.length > 4}
          >
            <HeadTable dataHeadTable={dataHeadEmailTable} />

            <BodyTable>
              {data.some((el) => el.fields.status === status)
                ? data.map((campaign, index) => (
                    <CampaignTableRow
                      key={`id-${campaign.id}`}
                      campaign={campaign}
                      index={index}
                      actualPage={actualPage}
                      dataPerPage={selectValue}
                      editCampaign={editCampaign}
                    />
                  ))
                : []}
            </BodyTable>
          </ContainerTable>
          {filteredData.length < 1 ? (
            <FooterText
              text="There are not campaigns with the status - "
              status={status}
            />
          ) : null}
        </>
      )}
    />
  );
};

export default CampaignStatus;

import { ReactNode, useState } from "react";
import { Typography } from "@mui/material";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { Campaign } from "types";

interface CampaignsListProps {
  subHeading: string;
  dataHeadEmailTable: ReactNode[];
  passedData: Campaign[];
  editCampaign: (campaign: Campaign) => void;
}

const CampaignsList = ({
  subHeading,
  dataHeadEmailTable,
  passedData,
  editCampaign,
}: CampaignsListProps) => {
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
              Actually the list of emails is empty - please add new email.
            </Typography>
          ) : (
            <ContainerTable
              subHeading={subHeading}
              passedData={passedData}
              setSelectValue={setSelectValue}
              disableSelect={passedData.length > 4}
            >
              <HeadTable dataHeadTable={dataHeadEmailTable} />
              <BodyTable>
                {data &&
                  data.map((campaign, index) => (
                    <CampaignTableRow
                      key={`id-${campaign.id}`}
                      campaign={campaign}
                      index={index}
                      actualPage={actualPage}
                      dataPerPage={selectValue}
                      editCampaign={editCampaign}
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

export default CampaignsList;

import PropTypes from "prop-types";
import { useState } from "react";
import { Typography } from "@mui/material";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const CampaignsList = (props) => {
  const {
    subHeading,
    dataHeadEmailTable,
    passedData,
    editCampaign,
    removeCampaign,
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
              Actually the list of emails is empty - please add new email.
            </Typography>
          ) : (
            <ContainerTable
              subHeading={subHeading}
              passedData={passedData}
              setSelectValue={setSelectValue}
              disableSelect={passedData.length > 4 ? true : false}
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
                      dataPerPage={parseInt(selectValue)}
                      editCampaign={editCampaign}
                      removeCampaign={removeCampaign}
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

CampaignsList.propTypes = {
  subHeading: PropTypes.string,
  dataHeadEmailTable: PropTypes.array,
  passedData: PropTypes.arrayOf(PropTypes.object),
  editCampaign: PropTypes.func,
  removeCampaign: PropTypes.func,
};

export default CampaignsList;

import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const CampaignsList = ({
  subHeading,
  dataHeadEmailTable,
  passedData,
  handleEditDetailsCampaign,
  removeCampaign,
  setContentPopup,
  setOpenConfirmPopup,
}) => {
  const [selectValue, setSelectValue] = useState(4);

  return (
    <CustomPaginator
      passedData={passedData}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
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
                  handleEditDetailsCampaign={handleEditDetailsCampaign}
                  removeCampaign={removeCampaign}
                  setContentPopup={setContentPopup}
                  setOpenConfirmPopup={setOpenConfirmPopup}
                />
              ))}
          </BodyTable>
        </ContainerTable>
      )}
    />
  );
};

// CampaignsList.propTypes = {
//   subHeading: PropTypes.string.isRequired,
//   dataHeadEmailTable: PropTypes.array.isRequired,
//   setSelectedData: PropTypes.func.isRequired,
//   setContentPopup: PropTypes.func.isRequired,
//   setOpenConfirmPopup: PropTypes.func.isRequired,
// };

export default CampaignsList;

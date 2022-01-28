import PropTypes from "prop-types";
import { useState } from "react";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  FooterText,
} from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
import { getFilteredDataByStatus } from "helpers";

const CampaignStatus = (props) => {
  const {
    subHeading,
    dataHeadEmailTable,
    passedData,
    status,
    handleEditDetailsCampaign,
    removeCampaign,
  } = props;
  const [selectValue, setSelectValue] = useState(4);
  const filteredData = getFilteredDataByStatus(passedData, status);

  return (
    <CustomPaginator
      passedData={filteredData}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <>
          <ContainerTable
            subHeading={subHeading}
            passedData={filteredData}
            setSelectValue={setSelectValue}
            disableSelect={filteredData.length > 4 ? true : false}
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
                      dataPerPage={parseInt(selectValue)}
                      handleEditDetailsCampaign={handleEditDetailsCampaign}
                      removeCampaign={removeCampaign}
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

// CampaignStatus.propTypes = {
//   subHeading: PropTypes.string.isRequired,
//   dataHeadEmailTable: PropTypes.array.isRequired,
//   status: PropTypes.string.isRequired,
//   handleEditDetailsCampaign: PropTypes.func.isRequired,
//   setSelectedData: PropTypes.func.isRequired,
//   setContentPopup: PropTypes.func.isRequired,
//   setOpenConfirmPopup: PropTypes.func.isRequired,
// };

export default CampaignStatus;

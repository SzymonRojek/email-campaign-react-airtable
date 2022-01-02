import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { CampaignTableRow } from "../CampaignTableRow";
import CustomPaginator from "../PaginationPackage/CustomPaginator";
import { getFilteredDataByStatus } from "helpers";

const CampaignStatus = (props) => {
  const {
    subHeading,
    dataHeadEmailTable,
    passedData,
    status,
    handleEditDetailsCampaign,
    setSelectedData,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  const [selectValue, setSelectValue] = useState(4);

  return passedData && passedData.some((el) => el.fields.status === status) ? (
    <CustomPaginator
      passedData={getFilteredDataByStatus(passedData, status)}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <ContainerTable
          subHeading={subHeading}
          passedData={passedData}
          setSelectValue={setSelectValue}
          disableSelect={
            getFilteredDataByStatus(passedData, status).length > 4
              ? true
              : false
          }
        >
          <HeadTable dataHeadTable={dataHeadEmailTable} />

          <BodyTable>
            {data.map((campaign, index) => (
              <CampaignTableRow
                key={`id-${campaign.id}`}
                campaign={{ ...campaign, group: "campaigns" }}
                index={index}
                actualPage={actualPage}
                dataPerPage={parseInt(selectValue)}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            ))}
          </BodyTable>
        </ContainerTable>
      )}
    />
  ) : (
    ""
  );
};

CampaignStatus.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default CampaignStatus;

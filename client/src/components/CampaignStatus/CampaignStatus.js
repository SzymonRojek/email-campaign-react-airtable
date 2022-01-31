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
    editCampaign,
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
                      editCampaign={editCampaign}
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

CampaignStatus.propTypes = {
  subHeading: PropTypes.string,
  dataHeadEmailTable: PropTypes.array,
  passedData: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string,
  editCampaign: PropTypes.func,
  removeCampaign: PropTypes.func,
};

export default CampaignStatus;

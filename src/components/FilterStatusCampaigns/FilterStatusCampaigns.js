import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { RowCampaign } from "../Table";

const FilterStatusCampaigns = (props) => {
  const {
    subHeading,
    campaignsData,
    dataHeadEmailTable,
    status,
    setSelectedData,
    handleEditCampaign,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  return campaignsData &&
    campaignsData.some((el) => el.fields.status === status) ? (
    <ContainerTable subHeading={subHeading}>
      <HeadTable dataHeadTable={dataHeadEmailTable} />

      <BodyTable>
        {campaignsData &&
          campaignsData
            .filter((subscriber) => subscriber.fields.status === status)
            .map((campaign, index) => (
              <RowCampaign
                children={
                  <TableCell component="th" scope="row">
                    {++index}.
                  </TableCell>
                }
                key={`id-${campaign.id}`}
                campaign={{ ...campaign, group: "campaigns" }}
                index={index}
                setSelectedData={setSelectedData}
                handleEditCampaign={handleEditCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            ))}
      </BodyTable>
    </ContainerTable>
  ) : (
    ""
  );
};

export default FilterStatusCampaigns;

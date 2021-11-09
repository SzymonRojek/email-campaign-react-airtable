import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { RowCampaign } from "../Table";

const FilterStatusCampaigns = (props) => {
  const {
    heading,
    campaignsData,
    dataHeadEmailTable,
    status,
    setSelectedData,
    handleEditCampaign,
    removeItem,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  return campaignsData &&
    campaignsData.some((el) => el.fields.status === status) ? (
    <>
      <h2
        style={{
          textAlign: "center",
          marginBottom: -40,
          color: "#003049",
          letterSpacing: 2,
        }}
      >
        {heading}
      </h2>
      <ContainerTable>
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
                  campaign={campaign}
                  index={index}
                  setSelectedData={setSelectedData}
                  handleEditCampaign={handleEditCampaign}
                  removeItem={removeItem}
                  setContentPopup={setContentPopup}
                  setOpenConfirmPopup={setOpenConfirmPopup}
                />
              ))}
        </BodyTable>
      </ContainerTable>
    </>
  ) : (
    ""
  );
};

export default FilterStatusCampaigns;

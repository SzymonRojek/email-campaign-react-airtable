import PropTypes from "prop-types";

import { useAPIcontext } from "contexts/APIcontextProvider";
import { dataHeadEmailTable } from "data/dataHeadTable";
import { getLatestAddedItem, sortDataAlphabetically } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { CampaignsList } from "components/CampaignsList";
import { Error, Loader } from "components/DisplayMessage";

const EmailsPage = ({ editCampaign, removeCampaign }) => {
  const { campaignsData } = useAPIcontext();

  return (
    <>
      {campaignsData.status === "loading" ? (
        <Loader title="Emails" />
      ) : campaignsData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo={`${campaignsData.data?.error.message || "Check endpoints"}`}
          titleThree="Also, please check your internet connection."
        />
      ) : !campaignsData.data.length ? (
        <Error
          titleOne="MESSAGE"
          titleTwo="There are no Emails added yet"
          titleThree="Please add a New Email"
        />
      ) : (
        campaignsData.status === "success" && (
          <StyledContainer>
            <StyledHeading label="all emails" />
            <StyledMainContent>
              <div style={{ marginBottom: 100 }}>
                <CampaignsList
                  subHeading="list"
                  dataHeadEmailTable={dataHeadEmailTable}
                  passedData={sortDataAlphabetically(campaignsData.data)}
                  editCampaign={editCampaign}
                  removeCampaign={removeCampaign}
                />
              </div>

              {campaignsData.data.length > 1 ? (
                <CampaignsList
                  subHeading="latest added"
                  dataHeadEmailTable={dataHeadEmailTable}
                  passedData={getLatestAddedItem(campaignsData.data)}
                  editCampaign={editCampaign}
                  removeCampaign={removeCampaign}
                />
              ) : (
                ""
              )}
            </StyledMainContent>
          </StyledContainer>
        )
      )}
    </>
  );
};

EmailsPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdTime: PropTypes.string,
        fields: PropTypes.shape({
          status: PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
        }),
      })
    ),
  }),
  editCampaign: PropTypes.func,
  removeCampaign: PropTypes.func,
};

export default EmailsPage;

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

import { useAPIcontext } from "contexts/APIcontextProvider";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { CampaignStatus } from "components/CampaignStatus";
import SelectInputController from "components/Inputs/SelectInputController";

const useSelectStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
      fontWeight: "bold",
      backgroundColor: "#142f43",
      minWidth: 20,
      fontSize: 14,
      padding: 10,
      margin: 0,
      transition: ".3 easy-out",
    },
    "& .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiSvgIcon-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ffa500",
    },
  },
});

const styles = {
  textError: { color: "transparent", padding: 0 },
};

const selectCampaignsStatus = [
  { value: "sent", label: "sent" },
  { value: "draft", label: "draft" },
];

const StatusEmailsPage = ({ editCampaign, removeCampaign }) => {
  const { campaignsData } = useAPIcontext();
  const { control, watch } = useForm();
  const [selectStatus, setSelectStatus] = useState("sent");

  const classesSelectStyles = useSelectStyles();

  const statusDataHeadTable = [
    "no",
    "title",
    "description",
    "date",
    "time",
    <SelectInputController
      control={control}
      name="status"
      defaultValue={selectStatus}
      data={selectCampaignsStatus}
      message=""
      error={false}
      classesSelectStyles={classesSelectStyles.root}
      styles={styles.textError}
    />,
    "details",
    "delete",
  ];

  useEffect(() => {
    const watchStatus = watch((value) => setSelectStatus(value.status));
    return () => watchStatus.unsubscribe();
  }, [watch]);

  return (
    <>
      {campaignsData.status === "loading" ? (
        <Loader title="Status" />
      ) : campaignsData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
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
            <StyledHeading label="email status" />
            <StyledMainContent>
              <CampaignStatus
                subHeading="list"
                dataHeadEmailTable={statusDataHeadTable}
                passedData={campaignsData.data}
                status={selectStatus}
                editCampaign={editCampaign}
                removeCampaign={removeCampaign}
              />
            </StyledMainContent>
          </StyledContainer>
        )
      )}
    </>
  );
};

StatusEmailsPage.propTypes = {
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

export default StatusEmailsPage;

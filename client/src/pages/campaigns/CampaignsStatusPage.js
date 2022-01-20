import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

import { Loader, Error } from "../../components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { CampaignStatus } from "../../components/CampaignStatus";
import SelectInputController from "components/Inputs/SelectInputController";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "rgb(221, 220, 220)",
      fontWeight: "bold",
      padding: "5px 12px",
      backgroundColor: "#142f43",
      minWidth: 20,
      fontSize: 14,
      transition: ".3 easy-out",
    },
    "& .MuiInputLabel-root": {
      color: "rgb(221, 220, 220)",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: "none",
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
    "&:hover .MuiMenuItem-root": {
      backgroundColor: "red",
    },
  },
});

const styles = {
  select: {
    menuItem: {
      backgroundColor: "#142f43",
      color: "rgb(221, 220, 220)",
      borderBottom: "1px solid #ddd",
    },
  },
};

const selectCampaignsStatus = [
  { value: "sent", label: "sent" },
  { value: "draft", label: "draft" },
];

const CampaignsStatusPage = (props) => {
  const {
    campaignsData,
    handleEditDetailsCampaign,
    setOpenConfirmPopup,
    setSelectedData,
    setContentPopup,
  } = props;

  const { control, watch } = useForm();
  const [selectStatus, setSelectStatus] = useState("sent");

  const statusDataHeadTable = [
    "no",
    "title",
    "description",
    <SelectInputController
      control={control}
      name="status"
      styles={styles.select}
      defaultValue={selectStatus}
      data={selectCampaignsStatus}
      message=""
      error={false}
      useStyles={useStyles}
    />,
    "created",
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
      ) : (
        <StyledContainer>
          {campaignsData.status === "success" && !campaignsData.data.length ? (
            <Error
              titleOne="There are not campaigns added yet."
              titleTwo="Please add a new campaign."
              titleThree="🙂"
            />
          ) : (
            <>
              <StyledHeading label="Campaigns Status" />

              <CampaignStatus
                subHeading="List"
                dataHeadEmailTable={statusDataHeadTable}
                passedData={campaignsData.data}
                status={selectStatus}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            </>
          )}
        </StyledContainer>
      )}
    </>
  );
};

CampaignsStatusPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }),
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignsStatusPage;

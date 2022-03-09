import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";

import api from "api";
import { Loader } from "components/DisplayMessage";
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

const StatusEmailsPage = ({ editCampaign }) => {
  const { data: campaigns, isLoading } = useQuery("campaigns", api.fetchItems, {
    meta: {
      myMessage: "Can not get campaigns list:",
    },
  });

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

  if (isLoading) {
    return <Loader title="Status" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="email status" />
      <StyledMainContent>
        {campaigns && !campaigns.length ? (
          "List of campaigns is empty - please add email"
        ) : (
          <CampaignStatus
            subHeading="list"
            dataHeadEmailTable={statusDataHeadTable}
            passedData={campaigns}
            status={selectStatus}
            editCampaign={editCampaign}
          />
        )}
      </StyledMainContent>
    </StyledContainer>
  );
};

StatusEmailsPage.propTypes = {
  editCampaign: PropTypes.func,
};

export default StatusEmailsPage;

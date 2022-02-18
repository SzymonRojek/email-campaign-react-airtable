import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

import { Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscriberStatus } from "components/SubscriberStatus";
import SelectInputController from "components/Inputs/SelectInputController";
import { useAPI } from "APiContextProvider";

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
  textError: {
    color: "transparent",
    paddingTop: 0,
  },
};

const selectSubscribersStatus = [
  { value: "active", label: "active" },
  { value: "pending", label: "pending" },
  { value: "blocked", label: "blocked" },
];

const StatusSubscribersPage = ({
  editSubscriber,
  handleSubscriberDetails,
  removeSubscriber,
}) => {
  const { subscribersData } = useAPI();
  const { control, watch } = useForm();
  const [selectStatus, setSelectStatus] = useState("active");

  const classesSelectStyles = useSelectStyles();

  const statusDataHeadTable = [
    "no",
    "name",
    "surname",
    <SelectInputController
      control={control}
      name="status"
      defaultValue={selectStatus}
      data={selectSubscribersStatus}
      message=""
      error={false}
      classesSelectStyles={classesSelectStyles.root}
      styles={styles.textError}
    />,
    "date",
    "time",
    "edit",
    "details",
    "delete",
  ];

  useEffect(() => {
    const watchStatus = watch((value) => setSelectStatus(value.status));
    return () => watchStatus.unsubscribe();
  }, [watch]);

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Status" />
      ) : (
        <StyledContainer>
          <StyledHeading label="subscribers status" />
          <StyledMainContent>
            {subscribersData.data && !subscribersData.data.length ? (
              "List of subscribers is empty - please add a subscriber"
            ) : (
              <SubscriberStatus
                subHeading="list"
                generalDataHeadTable={statusDataHeadTable}
                passedData={subscribersData.data}
                status={selectStatus}
                setSelectStatus={setSelectStatus}
                editSubscriber={editSubscriber}
                handleSubscriberDetails={handleSubscriberDetails}
                removeSubscriber={removeSubscriber}
              />
            )}
          </StyledMainContent>
        </StyledContainer>
      )}
    </>
  );
};

StatusSubscribersPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdTime: PropTypes.string,
        fields: PropTypes.shape({
          status: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          profession: PropTypes.string,
          email: PropTypes.string,
          salary: PropTypes.string,
          telephone: PropTypes.string,
        }),
      })
    ),
  }),
  editSubscriber: PropTypes.func,
  handleSubscriberDetails: PropTypes.func,
  removeSubscriber: PropTypes.func,
};

export default StatusSubscribersPage;

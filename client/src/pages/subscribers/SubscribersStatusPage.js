import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { SubscriberStatus } from "components/SubscriberStatus";
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
  selectContainer: { border: "3px solid orange", borderRadius: 3 },
  select: {
    menuItem: {
      backgroundColor: "#142f43",
      color: "rgb(221, 220, 220)",
      borderBottom: "1px solid #ddd",
    },
  },
};

const selectSubscribersStatus = [
  { value: "active", label: "active" },
  { value: "pending", label: "pending" },
  { value: "blocked", label: "blocked" },
];

const SubscribersStatusPage = ({
  subscribersData,
  handleSubscriberDetails,
  removeSubscriber,
}) => {
  const { control, watch } = useForm();
  const [selectStatus, setSelectStatus] = useState("active");

  const statusDataHeadTable = [
    "no",
    "name",
    "surname",
    <div style={styles.selectContainer}>
      <SelectInputController
        control={control}
        name="status"
        defaultValue={selectStatus}
        data={selectSubscribersStatus}
        message=""
        error={false}
        styles={styles.select}
        useStyles={useStyles}
      />
    </div>,
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
      {subscribersData.status === "loading" ? (
        <Loader title="Status" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      ) : !subscribersData.data.length ? (
        <Error
          titleOne="MESSAGE"
          titleTwo="There are no Subscribers added yet"
          titleThree="Please add a New Subscriber"
        />
      ) : (
        subscribersData.status === "success" && (
          <StyledContainer>
            <StyledHeading label="Subscribers status" />

            <SubscriberStatus
              subHeading="List"
              generalDataHeadTable={statusDataHeadTable}
              passedData={subscribersData.data}
              status={selectStatus}
              setSelectStatus={setSelectStatus}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={removeSubscriber}
            />
          </StyledContainer>
        )
      )}
    </>
  );
};

// SubscribersStatusPage.propTypes = {
//   subscribersData: PropTypes.shape({
//     status: PropTypes.string,
//     data: PropTypes.arrayOf(PropTypes.object),
//   }),
//   handleSubscriberDetails: PropTypes.func.isRequired,
//   setOpenConfirmPopup: PropTypes.func,
//   setSelectedData: PropTypes.func,
//   setContentPopup: PropTypes.func,
// };

export default SubscribersStatusPage;

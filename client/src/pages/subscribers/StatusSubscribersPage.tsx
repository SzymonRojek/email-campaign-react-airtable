import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

import { useSubscribers } from "customHooks/queries";
import { Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { SubscriberStatus } from "components/SubscriberStatus";
import { SelectInputController } from "components/Inputs";
import { SelectOption, Subscriber } from "types";

interface StatusSubscribersPageProps {
  editSubscriber: (subscriber: Subscriber) => void;
  handleSubscriberDetails: (subscriber: Subscriber) => void;
}

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
} as const;

const selectSubscribersStatus: SelectOption[] = [
  { value: "active", label: "active" },
  { value: "pending", label: "pending" },
  { value: "blocked", label: "blocked" },
];

const StatusSubscribersPage = ({
  editSubscriber,
  handleSubscriberDetails,
}: StatusSubscribersPageProps) => {
  const {
    data: subscribers,
    status,
    isLoading,
    isFetching,
  } = useSubscribers("Cannot get subscribers list:");

  const { control, watch } = useForm<{ status: string }>();
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
    const watchStatus = watch((value) => setSelectStatus(value.status ?? "active"));

    return () => watchStatus.unsubscribe();
  }, [watch]);

  if (isLoading || isFetching) {
    return <Loader title="loading" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="subscribers status" />
      <StyledMainContent>
        {status === "success" && (
          <SubscriberStatus
            subHeading="list"
            generalDataHeadTable={statusDataHeadTable}
            passedData={subscribers}
            status={selectStatus}
            editSubscriber={editSubscriber}
            handleSubscriberDetails={handleSubscriberDetails}
          />
        )}
      </StyledMainContent>
    </StyledContainer>
  );
};

export default StatusSubscribersPage;

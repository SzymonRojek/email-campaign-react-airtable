import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "@material-ui/core";

import api from "../../api";
import { capitalizeFirstLetter, validationCampaign } from "../../helpers";
import { FormCampaign } from "../../components/FormCampaign";
import { StyledHeading } from "../../components/StyledHeading";
import { emailMessage } from "../../mailgun/app";

const style = {
  title: { color: "green" },
};

const NewCampaign = ({
  isCalledRefCampaigns,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  const [actionStatus, setActionStatus] = useState("");

  const endpoint = "/campaigns";

  const onSubmit = (data) => {
    // if (actionStatus === "sent") {
    //   subscribersData.data
    //     .filter((subscriber) => subscriber.fields.status === "active")
    //     .forEach((subscriber) => {
    //       emailMessage(
    //         subscriber.fields.email,
    //         subscriber.fields.name,
    //         data.title,
    //         data.description
    //       );
    //     });
    // }

    api.post(endpoint, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: actionStatus,
      },
    });

    isCalledRefCampaigns.current = false;

    setContentPopup({
      title: "Yeah 🎊",
      text: (
        <>
          Campaign
          <span style={style.title}>
            <strong> {capitalizeFirstLetter(data.title)} </strong>
          </span>
          has been {actionStatus === "draft" ? "drafted and add" : "send"} to
          the data. 😁
        </>
      ),
      colorButton: "success",
    });

    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
    }, 3_000);
  };

  return (
    <Container>
      <StyledHeading label="Add Campaign:" />

      <FormCampaign
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        errors={errors}
        setActionStatus={setActionStatus}
        isCalledRefCampaigns={isCalledRefCampaigns}
      />
    </Container>
  );
};

NewCampaign.propTypes = {
  isCalledRefCampaigns: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }),
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default NewCampaign;

// note, in the future:
// before sent a data by the post method do again do the get method to get all fresh subs

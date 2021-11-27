import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { Container } from "@material-ui/core";

import api from "../../api";
import { useFetchDetailsById } from "../../useFetchDetailsById";
// import { emailMessage } from "../../mailgun/app";
import { capitalizeFirstLetter, validationCampaign } from "../../helpers";
import { FormCampaign } from "../../components/FormCampaign";
import { StyledHeading } from "../../components/StyledHeading";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";

const EditCampaign = ({
  isCalledRefCampaigns,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const endpoint = `/campaigns/${id}`;
  const { itemData } = useFetchDetailsById(endpoint);

  const defaultValues = {
    title: itemData.data ? itemData.data.fields.title : "",
    description: itemData.data ? itemData.data.fields.description : "",
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const [actionStatus, setActionStatus] = useState("");

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

    const isCampaignChanged =
      data.title !== itemData.data.fields.title ||
      data.description !== itemData.data.fields.description ||
      actionStatus === "sent"
        ? true
        : false;

    if (isCampaignChanged || actionStatus === "sent") {
      api.patch(endpoint, {
        fields: {
          title: capitalizeFirstLetter(data.title),
          description: capitalizeFirstLetter(data.description),
          status: actionStatus,
        },
      });
    }

    isCalledRefCampaigns.current = false;

    setContentPopup({
      text: isCampaignChanged
        ? "Campaign has been changed"
        : `Campaign has not been changed ${
            actionStatus !== "sent" ? "and status is still draft" : ""
          }.`,
      colorButton: "success",
      switch: navigate("/campaigns"),
    });

    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
      navigate("/campaigns");
    }, 3_000);
  };

  return (
    <>
      {itemData.status === "loading" ? (
        <Loader title="Campaign Details" />
      ) : itemData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Check the url address again."
          titleThree="Maybe there is no an access to the internet."
        />
      ) : (
        <Container>
          <StyledHeading label="Edit Campaign:" />

          <FormCampaign
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            control={control}
            errors={errors}
            setActionStatus={setActionStatus}
          />
        </Container>
      )}
    </>
  );
};

EditCampaign.propTypes = {
  isCalledRefCampaigns: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }),
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default EditCampaign;

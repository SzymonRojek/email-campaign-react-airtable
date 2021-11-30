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
  campaignsData,
  isCalledRefCampaigns,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const endpoint = `/campaigns/${id}`;

  const { itemData } = useFetchDetailsById(endpoint);

  const [isCampaignSent, setCampaignStatus] = useState(false);

  const defaultValues = {
    title: itemData.data ? itemData.data.fields.title : "",
    description: itemData.data ? itemData.data.fields.description : "",
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  // check if Campaign's id is available, otherwise return Error
  let isIdCorrect = null;

  if (id !== undefined && campaignsData.data !== null) {
    isIdCorrect = Boolean(campaignsData.data.find((item) => item.id === id));
  }

  if (isIdCorrect === false || itemData.status === "error") {
    return (
      <Error
        titleOne="Unfortunately, this Campaign does not exist."
        titleTwo="Check the url address."
        titleThree="Back to Subscribers."
      />
    );
  }

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
      data.description !== itemData.data.fields.description;

    if (isCampaignChanged || isCampaignSent) {
      api.patch(endpoint, {
        fields: {
          title: capitalizeFirstLetter(data.title),
          description: capitalizeFirstLetter(data.description),
          status: isCampaignSent ? "sent" : "draft",
        },
      });
    }

    isCalledRefCampaigns.current = false;

    const campaignTitle = (
      <span style={isCampaignSent ? { color: "green" } : { color: "orange" }}>
        <strong> {capitalizeFirstLetter(data.title)} </strong>
      </span>
    );

    setContentPopup({
      title: isCampaignSent ? (
        <span style={{ color: "green", fontWeight: "bold" }}>
          That's great 🎊
        </span>
      ) : (
        <span style={{ color: "orange", fontWeight: "bold" }}>
          Still draft... 🙂
        </span>
      ),
      text:
        isCampaignChanged && isCampaignSent ? (
          <> Campaign {campaignTitle} has been changed and finally sent 🙂</>
        ) : !isCampaignChanged && !isCampaignSent ? (
          <>
            Campaign {campaignTitle} has not been changed and status still is
            draft 🙂
          </>
        ) : !isCampaignChanged && isCampaignSent ? (
          <>Campaign {campaignTitle} has not been changed but finally sent 🙂</>
        ) : isCampaignChanged && !isCampaignSent ? (
          <>
            Campaign {campaignTitle} has been changed and status still is draft
            🙂
          </>
        ) : (
          <>Campaign {campaignTitle} has not been changed but finally sent 🙂</>
        ),
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
            setCampaignStatus={setCampaignStatus}
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

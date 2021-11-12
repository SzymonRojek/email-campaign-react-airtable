import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

import api from "../../api";
// import { emailMessage } from "../../mailgun/app";
import { capitalizeFirstLetter, validationCampaign } from "../../helpers";
import { FormCampaign } from "../../components/FormCampaign";

const EditCampaign = ({
  selectedData,
  getCampaignsData,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationCampaign),
    defaultValues: {
      title: selectedData ? selectedData.fields.title : "",
      description: selectedData ? selectedData.fields.description : "",
    },
  });

  const [actionStatus, setActionStatus] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoint = `/campaigns/${id}`;

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
      data.title !== selectedData.fields.title ||
      data.description !== selectedData.fields.description ||
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

    getCampaignsData();

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
      <h1
        style={{
          textAlign: "center",
          color: "#142F43",
          letterSpacing: 2,
        }}
      >
        Edit Campaign Data:
      </h1>
      <FormCampaign
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
        errors={errors}
        setActionStatus={setActionStatus}
        getCampaignsData={getCampaignsData}
      />
    </>
  );
};

export default EditCampaign;

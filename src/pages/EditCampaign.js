import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

import api from "../api";
import { capitalizeFirstLetter, validationCampaign } from "../helpers";
import { FormCampaign } from "../components/FormCampaign";

const EditCampaign = ({
  draftCampaign,
  getCampaignsData,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const editCampaignData = {
    title: draftCampaign ? draftCampaign.fields.title : "",
    description: draftCampaign ? draftCampaign.fields.description : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationCampaign),
    defaultValues: editCampaignData,
  });

  const [actionStatus, setActionStatus] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoint = `/campaigns/${id}`;

  const onSubmit = (data) => {
    const isCampaignChanged =
      (data.title !== draftCampaign.fields.title &&
        data.description !== draftCampaign.fields.description) ||
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

    setContentPopup({
      text: isCampaignChanged
        ? "Campaign has been changed"
        : `Campaign has not been changed ${
            actionStatus !== "sent" ? "and status is still draft" : ""
          }.`,
      colorButton: "success",
      switch: navigate("/campaigns"),
    });

    getCampaignsData();
    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
      navigate("/campaigns");
    }, 3_000);
  };

  return (
    <FormCampaign
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      setActionStatus={setActionStatus}
      getCampaignsData={getCampaignsData}
    />
  );
};

export default EditCampaign;

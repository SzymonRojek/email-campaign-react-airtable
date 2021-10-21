import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

import api from "../api";
import { capitalizeFirstLetter } from "../helpers";
import { FormCampaign } from "../components/FormCampaign";
import { useNavigate } from "react-router";

const validationSchemaCampaign = Yup.object().shape({
  title: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must not exceed 20 characters"),
  description: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must not exceed 60 characters"),
});

const EditCampaign = ({
  setOpenInfoPopup,
  setContentPopup,
  draftCampaign,
  getCampaignsData,
}) => {
  const editCampaignData = {
    title: draftCampaign ? draftCampaign.fields?.title : "",
    description: draftCampaign ? draftCampaign.fields?.description : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchemaCampaign),
    defaultValues: editCampaignData,
  });

  const [actionStatus, setActionStatus] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const endpoint = `/campaigns/${id}`;

  const onSubmit = (data) => {
    api.patch(endpoint, {
      fields: {
        title: data.title,
        description: data.description,
        status: actionStatus,
      },
    });

    setContentPopup({
      text: `Campaign ${capitalizeFirstLetter(
        data.title
      )} has been added to the data.`,
      colorButton: "success",
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

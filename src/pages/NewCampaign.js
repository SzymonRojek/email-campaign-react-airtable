import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import api from "../api";
import { capitalizeFirstLetter } from "../helpers";
import { FormCampaign } from "../components/FormCampaign";

const validationSchemaCampaign = Yup.object().shape({
  title: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 6 characters")
    .max(10, "Name must not exceed 10 characters"),
  description: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must not exceed 30 characters"),
});

const NewCampaign = ({
  setOpenInfoPopup,
  setContentPopup,
  getCampaignsData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchemaCampaign) });
  const [actionStatus, setActionStatus] = useState("");

  const endpoint = "/campaigns";

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        title: data.title,
        description: data.description,
        status: actionStatus,
      },
    });

    reset();

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

export default NewCampaign;

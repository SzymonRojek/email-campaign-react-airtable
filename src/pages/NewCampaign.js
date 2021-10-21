import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "../api";
import { capitalizeFirstLetter, validationCampaign } from "../helpers";
import { FormCampaign } from "../components/FormCampaign";

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
  } = useForm({ resolver: yupResolver(validationCampaign) });
  const [actionStatus, setActionStatus] = useState("");

  const endpoint = "/campaigns";

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
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

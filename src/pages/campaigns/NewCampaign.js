import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "../../api";
import { capitalizeFirstLetter, validationCampaign } from "../../helpers";
import { FormCampaign } from "../../components/FormCampaign";
import { emailMessage } from "../../mailgun/app";

const NewCampaign = ({
  subscribersData,
  setOpenInfoPopup,
  setContentPopup,
  getCampaignsData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
    defaultValues: { description: `Hello {{name}}! \n\n` },
  });
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

    getCampaignsData();

    reset();

    setContentPopup({
      text: `Campaign ${capitalizeFirstLetter(data.title)} has been ${
        actionStatus === "draft" ? "drafted and add" : "send"
      } to the data.`,
      colorButton: "success",
    });

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

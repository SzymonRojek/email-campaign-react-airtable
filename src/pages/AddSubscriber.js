import { Paper, Button, Box } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { TextInput } from "../components/TextInput";

import { Typography, TextField } from "@mui/material";

const AddSubscriber = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });

  const currentName = methods.watch("name");

  const onSubmit = () => (data) => {
    console.log(data);
  };

  return (
    <Paper elevation={6}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextInput />

          <Box mt={3}>
            <Button variant="contained" color="primary" type="submit">
              Add Subscriber
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default AddSubscriber;

// type="email"

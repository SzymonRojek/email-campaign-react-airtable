import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Typography } from "@mui/material";

import CustomTextInput from "./CustomTextInput";

const styleTypography = { color: "crimson", paddingTop: 4 };

const TextInputController = ({
  control,
  name,
  error,
  message,
  rows,
  multiline,
}) => (
  <>
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required: true }}
      render={({ field: { ref, ...field } }) => (
        <CustomTextInput
          {...field}
          inputRef={ref}
          error={error}
          rows={rows}
          multiline={multiline}
        />
      )}
    />

    <Typography variant="inherit" style={styleTypography}>
      {message}
    </Typography>
  </>
);

export default TextInputController;

import { useState } from "react";
import LogFormButton from "../LogFormButton/LogFormButton";

const LoginForm = ({ setValue }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setValue(() => inputValue);
  };

  const onChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 300,
        margin: "20px auto",
        padding: 60,
        backgroundColor: "#142f43",
        color: "orange",
      }}
    >
      <h1>Email Campaign</h1>

      <input
        placeholder="type admin"
        value={inputValue}
        type="text"
        onChange={onChange}
        style={{ padding: 10, marginTop: 20 }}
      />
      <LogFormButton label="log in" style={{ margin: "50px auto" }} />
    </form>
  );
};

export default LoginForm;

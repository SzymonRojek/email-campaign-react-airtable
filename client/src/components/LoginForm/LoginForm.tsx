import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationLogin } from "helpers";
import api from "services/api";
import { setToken } from "services/authToken";
import { getErrorMessage } from "services";
import { LoginFormValues } from "types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordField from "./PasswordField";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsLogIn } = useGlobalStoreContext();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(validationLogin),
  });

  const onSubmit = async ({ password }: LoginFormValues) => {
    try {
      const { token } = await api.post<{ token: string }>("/auth/login", {
        password,
      });

      setToken(token);
      setIsLogIn(true);
      navigate("/");
    } catch (error) {
      setError("password", { message: getErrorMessage(error) });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-semibold">Email Campaign</h1>
          </CardTitle>
          <CardDescription>
            Demo app - the password is <strong>admin</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-4"
          >
            <PasswordField
              id="password"
              label="Password"
              registration={register("password")}
              error={errors.password?.message}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm password"
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="brand"
              className="mt-2 h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

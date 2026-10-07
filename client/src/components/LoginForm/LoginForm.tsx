import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsGithub } from "react-icons/bs";
import { Info } from "lucide-react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationLogin } from "helpers";
import api from "services/api";
import { setToken } from "services/authToken";
import { getErrorMessage } from "services";
import ThemeToggle from "components/ThemeToggle";
import { LoginFormValues } from "types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    // a soft orange glow at the top - the only decoration of the page
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(60rem_28rem_at_50%_-8rem,color-mix(in_oklch,var(--brand)_16%,transparent),transparent)]">
      <ThemeToggle className="absolute top-4 right-4" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Email Campaign Dashboard</h1>
        <p className="mt-1 mb-8 text-sm text-muted-foreground">
          Sign in to manage subscribers and send campaigns.
        </p>

        <Card className="w-full max-w-sm">
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
              <Button
                type="submit"
                variant="brand"
                className="h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 flex max-w-sm items-center gap-2 rounded-lg border bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0 text-brand" aria-hidden />
          <span>
            Demo app - the password is{" "}
            <strong className="text-foreground">admin</strong>
          </span>
        </p>
      </div>

      <footer className="flex items-center justify-center gap-3 pb-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Szymon Rojek
        <a
          href="https://github.com/SzymonRojek/email-campaign-dashboard"
          target="_blank"
          rel="noreferrer"
          aria-label="Source code on GitHub"
          className="hover:text-foreground"
        >
          <BsGithub className="size-4" />
        </a>
      </footer>
    </div>
  );
};

export default LoginForm;

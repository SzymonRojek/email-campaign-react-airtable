import { useState } from "react";
import { useNavigate } from "react-router";
import { BsGithub } from "react-icons/bs";
import { Play } from "lucide-react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import api from "services/api";
import { setToken } from "services/authToken";
import { getErrorMessage } from "services";
import ThemeToggle from "components/ThemeToggle";
import LoginFeedback from "components/feedback/LoginFeedback";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsLogIn } = useGlobalStoreContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // the public demo - in with one click, no password to type
  const tryDemo = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { token } = await api.post<{ token: string }>("/auth/demo", {});

      setToken(token);
      setIsLogIn(true);
      navigate("/");
    } catch (error) {
      setError(getErrorMessage(error));
      setIsLoading(false);
    }
  };

  return (
    // a soft orange glow at the top - the only decoration of the page
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(60rem_28rem_at_50%_-8rem,color-mix(in_oklch,var(--brand)_16%,transparent),transparent)]">
      <ThemeToggle className="absolute top-4 right-4" />

      {/* not centred vertically: the feedback that loads below must not move the button */}
      <main className="flex flex-1 flex-col items-center px-4 pt-[14vh] pb-16">
        <h1 className="text-2xl font-semibold tracking-tight">Email Campaign Dashboard</h1>
        <p className="mt-1 mb-8 max-w-sm text-center text-sm text-muted-foreground">
          Send job offers to the right candidates in your talent pool - by role and
          budget, personalized, and never too often.
        </p>

        <div className="grid w-full max-w-xs gap-2">
          <Button
            type="button"
            variant="brand"
            className="h-11 text-base"
            disabled={isLoading}
            onClick={tryDemo}
          >
            <Play aria-hidden />
            {isLoading ? "Opening the demo..." : "Try the demo"}
          </Button>
          {error && (
            <p role="alert" className="text-center text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <LoginFeedback />
      </main>

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

import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleCheck, CircleX, MailMinus } from "lucide-react";

import { getErrorMessage } from "services";
import api from "services/api";
import { Loader } from "components/DisplayMessage";
import ThemeToggle from "components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OptOutInfo {
  email: string;
  isOptedOut: boolean;
}

// public (no login): the page behind the "Opt out" link in every e-mail
const OptOutPage = () => {
  const { token } = useParams();
  const info = useQuery({
    queryKey: ["/opt-out", { token }],
    queryFn: () => api.get<OptOutInfo>(`/opt-out/${token}`),
    retry: false,
  });
  const optOut = useMutation({
    mutationFn: () => api.post<{ email: string }>(`/opt-out/${token}`, {}),
  });

  const content = () => {
    if (info.isLoading) return <Loader title="Checking the link..." />;

    if (info.isError || !info.data) {
      return (
        <Result icon={<CircleX className="size-6 text-destructive" aria-hidden />} title="This link is not valid">
          The opt-out link is broken or not complete. Please use the whole link from the
          e-mail.
        </Result>
      );
    }

    if (optOut.isSuccess || info.data.isOptedOut) {
      return (
        <Result
          icon={<CircleCheck className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden />}
          title="You opted out"
        >
          <strong className="text-foreground">{info.data.email}</strong> will not get any more
          job offers.
        </Result>
      );
    }

    return (
      <Result icon={<MailMinus className="size-6 text-brand" aria-hidden />} title="Opt out?">
        <strong className="text-foreground">{info.data.email}</strong> will not get any more
        job offers from us.
        {optOut.isError && (
          <span role="alert" className="mt-3 block text-destructive">
            {getErrorMessage(optOut.error)}
          </span>
        )}
        <Button
          variant="brand"
          className="mt-6 h-10 w-full"
          disabled={optOut.isPending}
          onClick={() => optOut.mutate()}
        >
          {optOut.isPending ? "Opting out..." : "Opt out"}
        </Button>
      </Result>
    );
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <ThemeToggle className="absolute top-4 right-4" />
      <p className="mb-6 text-sm font-medium text-muted-foreground">Talent Outreach</p>
      <Card className="w-full max-w-sm">
        <CardContent>{content()}</CardContent>
      </Card>
    </main>
  );
};

const Result = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col items-center text-center">
    <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
      {icon}
    </span>
    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-2 w-full text-sm text-muted-foreground">{children}</p>
  </div>
);

export default OptOutPage;

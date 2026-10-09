import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleCheck, CircleX, MailMinus } from "lucide-react";

import { getErrorMessage } from "services";
import api from "services/api";
import { Loader } from "components/DisplayMessage";
import ThemeToggle from "components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UnsubscribeInfo {
  email: string;
  isUnsubscribed: boolean;
}

// public (no login): the page behind the "Unsubscribe" link in every e-mail
const UnsubscribePage = () => {
  const { token } = useParams();
  const info = useQuery({
    queryKey: ["/unsubscribe", { token }],
    queryFn: () => api.get<UnsubscribeInfo>(`/unsubscribe/${token}`),
    retry: false,
  });
  const unsubscribe = useMutation({
    mutationFn: () => api.post<{ email: string }>(`/unsubscribe/${token}`, {}),
  });

  const content = () => {
    if (info.isLoading) return <Loader title="Checking the link..." />;

    if (info.isError || !info.data) {
      return (
        <Result icon={<CircleX className="size-6 text-destructive" aria-hidden />} title="This link is not valid">
          The unsubscribe link is broken or not complete. Please use the whole link from the
          e-mail.
        </Result>
      );
    }

    if (unsubscribe.isSuccess || info.data.isUnsubscribed) {
      return (
        <Result
          icon={<CircleCheck className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden />}
          title="You are unsubscribed"
        >
          <strong className="text-foreground">{info.data.email}</strong> will not get any more
          campaigns.
        </Result>
      );
    }

    return (
      <Result icon={<MailMinus className="size-6 text-brand" aria-hidden />} title="Unsubscribe?">
        <strong className="text-foreground">{info.data.email}</strong> will not get any more
        campaigns from Email Campaign Dashboard.
        {unsubscribe.isError && (
          <span role="alert" className="mt-3 block text-destructive">
            {getErrorMessage(unsubscribe.error)}
          </span>
        )}
        <Button
          variant="brand"
          className="mt-6 h-10 w-full"
          disabled={unsubscribe.isPending}
          onClick={() => unsubscribe.mutate()}
        >
          {unsubscribe.isPending ? "Unsubscribing..." : "Unsubscribe"}
        </Button>
      </Result>
    );
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <ThemeToggle className="absolute top-4 right-4" />
      <p className="mb-6 text-sm font-medium text-muted-foreground">Email Campaign Dashboard</p>
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

export default UnsubscribePage;

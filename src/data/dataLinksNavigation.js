export const mainLinksNavigation = [
  { to: "/subscribers", name: "Subscribers" },
  { to: "/campaigns", name: "Email Campaigns" },
  { to: "/", exact: true, name: "Home" },
];

export const subscribersLinksNavigation = [
  // {
  //   to: "",
  //   exact: true,
  //   name: "Subscribers List",
  // },
  {
    to: "filter",
    name: "Filter by status",
  },
  {
    to: "add-subscriber",
    name: "New Subscriber",
  },
];

export const campaignsLinksNavigation = [
  // {
  //   to: "",
  //   exact: true,
  //   name: "Campaigns List",
  // },
  {
    to: "filter",
    name: "Filter by status",
  },
  {
    to: "add-email",
    name: "New Campaign",
  },
];

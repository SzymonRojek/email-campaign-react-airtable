export const mainLinksNavigation = [
  { to: "/subscribers", name: "Subscribers" },
  { to: "/campaigns", name: "Campaigns" },
  { to: "/", exact: true, name: "Home" },
];

export const subscribersLinksNavigation = [
  {
    to: "",
    exact: true,
    name: "Subscribers",
  },
  {
    to: "filter",
    name: "Status",
  },
  {
    to: "add",
    name: "Add",
  },
];

export const campaignsLinksNavigation = [
  {
    to: "",
    exact: true,
    name: "Campaigns",
  },
  {
    to: "filter",
    name: "Status",
  },
  {
    to: "add",
    name: "Add",
  },
];
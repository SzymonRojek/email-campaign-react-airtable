export const mainLinksNavigation = [
  { to: "/subscribers", name: "Subscribers" },
  { to: "/campaigns", name: "Campaigns" },
  { to: "/", exact: true, name: "Home" },
];

export const subLinksNavigation = [
  {
    to: "",
    exact: true,
    name: "List",
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

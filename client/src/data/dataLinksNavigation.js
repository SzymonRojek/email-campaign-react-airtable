import { AiFillMail } from "react-icons/ai";
import { SiStatuspage } from "react-icons/si";
import { IoIosPeople } from "react-icons/io";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";

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
    to: "status",
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
    to: "status",
    name: "Status",
  },
  {
    to: "add",
    name: "Add",
  },
];

export const subscribersLinks = [
  {
    icon: <IoIosPeople />,
    to: "/subscribers",
    name: "Subscribers",
    tabsValue: 0,
  },
  {
    icon: <SiStatuspage />,
    to: "/subscribers/status",
    name: "Status",
    tabsValue: 0,
  },
  {
    icon: <BsFillPersonPlusFill />,
    to: "/subscribers/add",
    name: "Add New",
    tabsValue: 0,
  },
];

export const campaignsLinks = [
  {
    icon: <AiFillMail />,
    to: "/campaigns",
    name: "Campaigns",
    tabsValue: 1,
  },
  {
    icon: <SiStatuspage />,
    to: "/campaigns/status",
    name: "Status",
    tabsValue: 1,
  },
  {
    icon: <MdOutlineMarkEmailRead />,
    to: "/campaigns/add",
    name: "Add New",
    tabsValue: 1,
  },
];

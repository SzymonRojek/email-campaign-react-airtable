import React from "react";
import NavLink from "../NavLink/NavLink";
import { Outlet } from "react-router-dom";

import Menu from "../Menu/Menu";

const common = {
  margin: 15,
  padding: "10px 15px",
  fontSize: 20,
  fontWeight: 600,
  letterSpacing: 1,
  textDecoration: "none",
  borderRadius: 4,
};

const active = {
  color: "#303f9f",
  borderTop: "1px solid #303f9f",
  borderBottom: "1px solid #303f9f",
  ...common,
};

const inactive = {
  color: "#fff",
  backgroundColor: "#ccc",
  ...common,
};

const subscribersNavigationLinksData = [
  {
    to: "",
    exact: true,
    name: "Subscribers List",
  },
  {
    to: "filter",
    exact: false,
    name: "Filter by status",
  },
  {
    to: "add-subscriber",
    exact: false,
    name: "New Subscriber",
  },
];

const SubscribersNavigation = () => (
  <>
    <div className="header-subNavigation">
      <Menu>
        <ul className="header-list">
          {subscribersNavigationLinksData.map(({ to, exact, name }) => (
            <li key={name}>
              <NavLink
                to={to}
                exact={exact}
                active={active}
                inactive={inactive}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </Menu>
    </div>
    <div>
      <Outlet />
    </div>
  </>
);

export default SubscribersNavigation;

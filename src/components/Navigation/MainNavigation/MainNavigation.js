import React from "react";

import "./styles.css";
import Menu from "../Menu/Menu";

import NavLink from "../NavLink/NavLink";

const mainNavigationLinksData = [
  { to: "/subscribers", name: "Subscribers" },
  { to: "campaigns", name: "Email Campaigns" },
  { to: "/home", name: "Home" },
];

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
  color: "#fff",
  backgroundColor: "#303f9f",
  ...common,
};

const inactive = {
  color: "#fff",
  backgroundColor: "#b2b7d7",
  ...common,
};

const Navigation = () => (
  <div className="header-container">
    <Menu>
      <ul className="header-list">
        {mainNavigationLinksData.map(({ to, name, exact }) => (
          <li key={name}>
            <NavLink
              to={to}
              exact={exact ? exact : ""}
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
);

export default Navigation;

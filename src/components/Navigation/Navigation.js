import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./styles.css";
import Menu from "./Menu";

const Navigation = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  return (
    <div className="header-container">
      <Menu>
        <ul className="header-list">
          <li
            className={`header-link ${
              splitLocation[1] === "subscribers" ? "active" : ""
            }`}
          >
            <NavLink to="/subscribers" className="link">
              Subscribers
            </NavLink>
          </li>
          <li
            className={`header-link ${
              splitLocation[1] === "campaigns" ? "active" : ""
            }`}
          >
            <NavLink to="/campaigns" className="link">
              Campaigns
            </NavLink>
          </li>
          <li
            className={`header-link ${
              splitLocation[1] === "new-campaign" ? "active" : ""
            }`}
          >
            <NavLink to="/new-campaign" className="link">
              New Campaign
            </NavLink>
          </li>
          <li
            className={`header-link ${splitLocation[1] === "" ? "active" : ""}`}
          >
            <NavLink to="/" className="link">
              Home
            </NavLink>
          </li>
        </ul>
      </Menu>
    </div>
  );
};

export default Navigation;

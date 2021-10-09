import React from "react";

import "./styles.css";
import Menu from "./Menu";

import NavLink from "./NavLink";

const MainNavigation = () => {
  return (
    <>
      <div className="header-container">
        <Menu>
          <ul className="header-list">
            <li>
              <NavLink to="/subscribers">Subscribers</NavLink>
            </li>
            <li>
              <NavLink to="/campaigns">Campaigns</NavLink>
            </li>
            <li>
              <NavLink to="/new-campaign">New Campaign</NavLink>
            </li>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
          </ul>
        </Menu>
      </div>
    </>
  );
};

export default MainNavigation;

// create an array with links

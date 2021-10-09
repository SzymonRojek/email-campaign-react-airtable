import React from "react";
import NavLink from "./NavLink";
import { Outlet } from "react-router-dom";

import "./styles.css";
import Menu from "./Menu";

const SubscribersNav = () => {
  return (
    <>
      <div className="header-container">
        <Menu>
          <h1>Subscirbers</h1>
          <ul className="header-list">
            <li>
              <NavLink to="" exact={true}>
                Subscribers List
              </NavLink>
            </li>
            <li>
              <NavLink to="add-subscriber">Add Subscriber</NavLink>
            </li>
            <li>
              <NavLink to="filtered-status">Filter by status</NavLink>
            </li>
          </ul>
        </Menu>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default SubscribersNav;

// create an array with links

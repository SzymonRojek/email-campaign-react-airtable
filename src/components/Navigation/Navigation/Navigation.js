import { Outlet } from "react-router-dom";

import "./styles.css";
import Menu from "../Menu/Menu";
import NavLink from "../NavLink/NavLink";
import { DrawerMenu } from "../../DrawerMenu";

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
  backgroundColor: "#303f9f",
  ...common,
};

const Navigation = ({ dataLinks, className }) => (
  <>
    <div className={className}>
      <Menu>
        <ul className="header-list">
          {dataLinks.map(({ to, exact, name }) => (
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

    <DrawerMenu />
  </>
);

export default Navigation;
